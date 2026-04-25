const cron = require("node-cron");
const { Investment, Wallet, Transaction } = require("../models");
const {
  INVESTMENT_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} = require("../config/constants");

let investmentCronTask = null;

const processMaturedInvestments = async () => {
  const now = new Date();
  const maturedInvestments = await Investment.find({
    status: INVESTMENT_STATUS.ACTIVE,
    maturityDate: { $lte: now },
  }).limit(100);

  let processed = 0;

  for (const investment of maturedInvestments) {
    const lockedInvestment = await Investment.findOneAndUpdate(
      {
        _id: investment._id,
        status: INVESTMENT_STATUS.ACTIVE,
      },
      {
        status: INVESTMENT_STATUS.PROCESSING,
      },
      { new: true }
    );

    if (!lockedInvestment) continue;

    let walletCredited = false;
    let payoutTransactionId = null;
    let previousBalance = null;
    let newBalance = null;

    try {
      const wallet = await Wallet.findOne({ user: lockedInvestment.user });

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      previousBalance = wallet.getBalance(lockedInvestment.cryptocurrency);
      newBalance = wallet.updateBalance(
        lockedInvestment.cryptocurrency,
        lockedInvestment.payoutAmount
      );
      await wallet.save();
      walletCredited = true;

      const payoutTransaction = await Transaction.create({
        user: lockedInvestment.user,
        type: TRANSACTION_TYPES.INVESTMENT_PAYOUT,
        cryptocurrency: lockedInvestment.cryptocurrency,
        amount: lockedInvestment.payoutAmount,
        status: TRANSACTION_STATUS.COMPLETED,
        completedAt: new Date(),
        metadata: {
          investmentId: lockedInvestment._id,
          planId: lockedInvestment.plan,
          planName: lockedInvestment.planSnapshot.name,
          principal: lockedInvestment.amount,
          profit: lockedInvestment.profit,
          roi: lockedInvestment.planSnapshot.roi,
          duration: lockedInvestment.planSnapshot.duration,
          balanceBefore: previousBalance,
          balanceAfter: newBalance,
        },
      });
      payoutTransactionId = payoutTransaction._id;

      lockedInvestment.status = INVESTMENT_STATUS.COMPLETED;
      lockedInvestment.completedAt = new Date();
      lockedInvestment.payoutTransaction = payoutTransactionId;
      lockedInvestment.metadata = {
        ...lockedInvestment.metadata,
        payoutBalanceBefore: previousBalance,
        payoutBalanceAfter: newBalance,
      };
      await lockedInvestment.save();

      processed += 1;
    } catch (error) {
      if (walletCredited) {
        await Investment.updateOne(
          {
            _id: lockedInvestment._id,
            status: INVESTMENT_STATUS.PROCESSING,
          },
          {
            status: INVESTMENT_STATUS.COMPLETED,
            completedAt: new Date(),
            payoutTransaction: payoutTransactionId,
            "metadata.payoutBalanceBefore": previousBalance,
            "metadata.payoutBalanceAfter": newBalance,
            "metadata.payoutProcessingWarning": error.message,
            "metadata.payoutProcessingWarningAt": new Date(),
          }
        );

        processed += 1;
        console.error(
          `Investment ${lockedInvestment._id} was credited but had a bookkeeping warning:`,
          error
        );
        continue;
      }

      await Investment.updateOne(
        {
          _id: lockedInvestment._id,
          status: INVESTMENT_STATUS.PROCESSING,
        },
        {
          status: INVESTMENT_STATUS.ACTIVE,
          "metadata.lastProcessingError": error.message,
          "metadata.lastProcessingErrorAt": new Date(),
        }
      );

      console.error(
        `Failed to process investment ${lockedInvestment._id}:`,
        error
      );
    }
  }

  return processed;
};

const startInvestmentCron = () => {
  if (investmentCronTask || process.env.DISABLE_INVESTMENT_CRON === "true") {
    return investmentCronTask;
  }

  const schedule = process.env.INVESTMENT_CRON_SCHEDULE || "* * * * *";

  investmentCronTask = cron.schedule(schedule, async () => {
    try {
      const processed = await processMaturedInvestments();
      if (processed > 0) {
        console.log(`Processed ${processed} matured investment(s)`);
      }
    } catch (error) {
      console.error("Investment cron failed:", error);
    }
  });

  console.log(`Investment cron started with schedule: ${schedule}`);
  return investmentCronTask;
};

module.exports = {
  startInvestmentCron,
  processMaturedInvestments,
};
