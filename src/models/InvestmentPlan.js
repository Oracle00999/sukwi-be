const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      maxlength: [100, "Plan name cannot exceed 100 characters"],
    },

    roi: {
      type: Number,
      required: [true, "ROI is required"],
      min: [0.01, "ROI must be greater than 0"],
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
    },

    minAmount: {
      type: Number,
      required: [true, "Minimum amount is required"],
      min: [0.01, "Minimum amount must be at least 0.01"],
    },

    maxAmount: {
      type: Number,
      required: [true, "Maximum amount is required"],
      min: [0.01, "Maximum amount must be at least 0.01"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

investmentPlanSchema.pre("validate", function () {
  if (
    this.minAmount !== undefined &&
    this.maxAmount !== undefined &&
    this.maxAmount < this.minAmount
  ) {
    this.invalidate("maxAmount", "Maximum amount cannot be less than minimum amount");
  }
});

investmentPlanSchema.methods.getDetails = function () {
  return {
    id: this._id,
    name: this.name,
    roi: this.roi,
    duration: this.duration,
    minAmount: this.minAmount,
    maxAmount: this.maxAmount,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

investmentPlanSchema.index({ isActive: 1, createdAt: -1 });

const InvestmentPlan = mongoose.model("InvestmentPlan", investmentPlanSchema);

module.exports = InvestmentPlan;
