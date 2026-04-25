const mongoose = require("mongoose");
const {
  CRYPTO_TYPES,
  INVESTMENT_STATUS,
} = require("../config/constants");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPlan",
      required: true,
    },

    planSnapshot: {
      name: {
        type: String,
        required: true,
      },
      roi: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      minAmount: {
        type: Number,
        required: true,
      },
      maxAmount: {
        type: Number,
        required: true,
      },
    },

    cryptocurrency: {
      type: String,
      enum: Object.values(CRYPTO_TYPES),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be at least 0.01"],
    },

    profit: {
      type: Number,
      required: true,
      min: [0, "Profit cannot be negative"],
    },

    payoutAmount: {
      type: Number,
      required: true,
      min: [0.01, "Payout amount must be at least 0.01"],
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    maturityDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(INVESTMENT_STATUS),
      default: INVESTMENT_STATUS.ACTIVE,
    },

    completedAt: {
      type: Date,
    },

    payoutTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

investmentSchema.virtual("investmentId").get(function () {
  return `INV${this._id.toString().slice(-8).toUpperCase()}`;
});

investmentSchema.methods.getDetails = function () {
  return {
    id: this._id,
    investmentId: this.investmentId,
    plan: this.plan,
    planSnapshot: this.planSnapshot,
    cryptocurrency: this.cryptocurrency,
    amount: this.amount,
    profit: this.profit,
    payoutAmount: this.payoutAmount,
    startDate: this.startDate,
    maturityDate: this.maturityDate,
    status: this.status,
    completedAt: this.completedAt,
    createdAt: this.createdAt,
  };
};

investmentSchema.index({ user: 1, createdAt: -1 });
investmentSchema.index({ status: 1, maturityDate: 1 });
investmentSchema.index({ plan: 1 });

investmentSchema.set("toJSON", { virtuals: true });
investmentSchema.set("toObject", { virtuals: true });

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
