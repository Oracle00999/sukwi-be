const { User, Wallet } = require("../models");
const { successResponse } = require("../utils/responseHandler");

const validCryptos = [
  "bitcoin",
  "ethereum",
  "tether",
  "binance-coin",
  "solana",
  "ripple",
  "stellar",
  "dogecoin",
  "tron",
];

// @desc    Fund user account
// @route   POST /api/admin/users/:userId/fund
// @access  Private/Admin
const fundUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cryptocurrency } = req.body;
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!cryptocurrency || !validCryptos.includes(cryptocurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cryptocurrency",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "User wallet not found",
      });
    }

    const currentBalance = wallet.getBalance(cryptocurrency);
    const newBalance = wallet.updateBalance(cryptocurrency, amount);
    await wallet.save();

    successResponse(
      res,
      {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        funding: {
          cryptocurrency,
          amount,
          previousBalance: currentBalance,
          newBalance,
          totalValue: wallet.totalValue,
        },
        message: `Successfully funded ${user.firstName}'s ${cryptocurrency} account with $${amount}`,
      },
      "User account funded successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Deduct user account balance
// @route   POST /api/admin/users/:userId/deduct
// @access  Private/Admin
const deductUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cryptocurrency } = req.body;
    const amount = Number(req.body.amount);
    const adminId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!cryptocurrency || !validCryptos.includes(cryptocurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cryptocurrency",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "User wallet not found",
      });
    }

    const currentBalance = wallet.getBalance(cryptocurrency);

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${cryptocurrency} balance`,
      });
    }

    const newBalance = wallet.updateBalance(cryptocurrency, -amount);
    await wallet.save();

    successResponse(
      res,
      {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        deduction: {
          cryptocurrency,
          amount,
          previousBalance: currentBalance,
          newBalance,
          totalValue: wallet.totalValue,
          deductedBy: adminId,
        },
        message: `Successfully deducted $${amount} from ${user.firstName}'s ${cryptocurrency} account`,
      },
      "User account balance deducted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fundUserAccount,
  deductUserAccount,
};
