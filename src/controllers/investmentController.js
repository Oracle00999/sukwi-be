const {
  InvestmentPlan,
  Investment,
  Wallet,
  Transaction,
} = require("../models");
const { successResponse } = require("../utils/responseHandler");
const {
  CRYPTO_TYPES,
  INVESTMENT_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} = require("../config/constants");

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const getPlanAmountsFromBody = (body) => ({
  minAmount: body.minAmount ?? body.min,
  maxAmount: body.maxAmount ?? body.max,
});

const formatInvestmentForAdmin = (investment) => ({
  ...investment.getDetails(),
  user: investment.user
    ? {
        id: investment.user._id,
        name: `${investment.user.firstName} ${investment.user.lastName}`,
        email: investment.user.email,
      }
    : undefined,
});

// @desc    Get active investment plans
// @route   GET /api/investments/plans
// @access  Private
const getAvailablePlans = async (req, res, next) => {
  try {
    const plans = await InvestmentPlan.find({ isActive: true }).sort({
      createdAt: -1,
    });

    successResponse(
      res,
      { plans: plans.map((plan) => plan.getDetails()) },
      "Investment plans retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Invest in a plan
// @route   POST /api/investments/invest
// @access  Private
const createInvestment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { planId, cryptocurrency } = req.body;
    const amount = Number(req.body.amount);

    if (!Object.values(CRYPTO_TYPES).includes(cryptocurrency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cryptocurrency",
      });
    }

    const plan = await InvestmentPlan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Investment plan not found or inactive",
      });
    }

    if (amount < plan.minAmount || amount > plan.maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Amount must be between ${plan.minAmount} and ${plan.maxAmount}`,
      });
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    const currentBalance = wallet.getBalance(cryptocurrency);

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${cryptocurrency} balance`,
      });
    }

    const profit = roundMoney((amount * plan.roi) / 100);
    const payoutAmount = roundMoney(amount + profit);
    const startDate = new Date();
    const maturityDate = new Date(startDate);
    maturityDate.setDate(maturityDate.getDate() + plan.duration);

    const newBalance = wallet.updateBalance(cryptocurrency, -amount);
    await wallet.save();

    const investment = await Investment.create({
      user: userId,
      plan: plan._id,
      planSnapshot: {
        name: plan.name,
        roi: plan.roi,
        duration: plan.duration,
        minAmount: plan.minAmount,
        maxAmount: plan.maxAmount,
      },
      cryptocurrency,
      amount,
      profit,
      payoutAmount,
      startDate,
      maturityDate,
      status: INVESTMENT_STATUS.ACTIVE,
      metadata: {
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
      },
    });

    await Transaction.create({
      user: userId,
      type: TRANSACTION_TYPES.INVESTMENT,
      cryptocurrency,
      amount,
      status: TRANSACTION_STATUS.COMPLETED,
      completedAt: new Date(),
      metadata: {
        investmentId: investment._id,
        planId: plan._id,
        planName: plan.name,
        roi: plan.roi,
        duration: plan.duration,
        payoutAmount,
      },
    });

    successResponse(
      res,
      {
        investment: investment.getDetails(),
        wallet: {
          cryptocurrency,
          previousBalance: currentBalance,
          newBalance,
          totalValue: wallet.totalValue,
        },
      },
      "Investment created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's investments
// @route   GET /api/investments/my
// @access  Private
const getMyInvestments = async (req, res, next) => {
  try {
    const { status, cryptocurrency, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (cryptocurrency) filter.cryptocurrency = cryptocurrency;

    const investments = await Investment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Investment.countDocuments(filter);

    successResponse(
      res,
      {
        investments: investments.map((investment) => investment.getDetails()),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Investments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's active investments
// @route   GET /api/investments/active
// @access  Private
const getMyActiveInvestments = async (req, res, next) => {
  try {
    const { cryptocurrency, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      user: req.user.id,
      status: INVESTMENT_STATUS.ACTIVE,
    };

    if (cryptocurrency) filter.cryptocurrency = cryptocurrency;

    const investments = await Investment.find(filter)
      .sort({ maturityDate: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Investment.countDocuments(filter);

    successResponse(
      res,
      {
        investments: investments.map((investment) => investment.getDetails()),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Active investments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's investment by ID
// @route   GET /api/investments/:id
// @access  Private
const getMyInvestmentById = async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    successResponse(
      res,
      { investment: investment.getDetails() },
      "Investment retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create investment plan
// @route   POST /api/admin/investment-plans
// @access  Private/Admin
const createPlan = async (req, res, next) => {
  try {
    const { minAmount, maxAmount } = getPlanAmountsFromBody(req.body);

    const plan = await InvestmentPlan.create({
      name: req.body.name,
      roi: req.body.roi,
      duration: req.body.duration,
      minAmount,
      maxAmount,
      createdBy: req.user.id,
    });

    successResponse(
      res,
      { plan: plan.getDetails() },
      "Investment plan created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all investment plans
// @route   GET /api/admin/investment-plans
// @access  Private/Admin
const getPlans = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};

    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const plans = await InvestmentPlan.find(filter).sort({ createdAt: -1 });

    successResponse(
      res,
      { plans: plans.map((plan) => plan.getDetails()) },
      "Investment plans retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get investment plan by ID
// @route   GET /api/admin/investment-plans/:id
// @access  Private/Admin
const getPlanById = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Investment plan not found",
      });
    }

    successResponse(
      res,
      { plan: plan.getDetails() },
      "Investment plan retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update investment plan
// @route   PUT /api/admin/investment-plans/:id
// @access  Private/Admin
const updatePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Investment plan not found",
      });
    }

    const { minAmount, maxAmount } = getPlanAmountsFromBody(req.body);

    if (req.body.name !== undefined) plan.name = req.body.name;
    if (req.body.roi !== undefined) plan.roi = req.body.roi;
    if (req.body.duration !== undefined) plan.duration = req.body.duration;
    if (minAmount !== undefined) plan.minAmount = minAmount;
    if (maxAmount !== undefined) plan.maxAmount = maxAmount;
    if (req.body.isActive !== undefined) {
      plan.isActive = req.body.isActive === true || req.body.isActive === "true";
    }

    if (Number(plan.maxAmount) < Number(plan.minAmount)) {
      return res.status(400).json({
        success: false,
        message: "maxAmount cannot be less than minAmount",
      });
    }

    plan.updatedBy = req.user.id;

    await plan.save();

    successResponse(
      res,
      { plan: plan.getDetails() },
      "Investment plan updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete investment plan
// @route   DELETE /api/admin/investment-plans/:id
// @access  Private/Admin
const deletePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Investment plan not found",
      });
    }

    plan.isActive = false;
    plan.deletedBy = req.user.id;
    plan.deletedAt = new Date();
    await plan.save();

    successResponse(
      res,
      { plan: plan.getDetails() },
      "Investment plan disabled successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user investments
// @route   GET /api/admin/investments
// @access  Private/Admin
const getAllInvestments = async (req, res, next) => {
  try {
    const {
      status,
      cryptocurrency,
      userId,
      planId,
      page = 1,
      limit = 20,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (status) filter.status = status;
    if (cryptocurrency) filter.cryptocurrency = cryptocurrency;
    if (userId) filter.user = userId;
    if (planId) filter.plan = planId;

    const investments = await Investment.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Investment.countDocuments(filter);

    successResponse(
      res,
      {
        investments: investments.map(formatInvestmentForAdmin),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Investments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailablePlans,
  createInvestment,
  getMyInvestments,
  getMyActiveInvestments,
  getMyInvestmentById,
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getAllInvestments,
};
