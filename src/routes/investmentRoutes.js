const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/investmentController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { createInvestmentValidation } = require("../utils/validators");

router.use(protect);

router.get("/plans", investmentController.getAvailablePlans);
router.post(
  "/invest",
  validate(createInvestmentValidation),
  investmentController.createInvestment
);
router.get("/active", investmentController.getMyActiveInvestments);
router.get("/my", investmentController.getMyInvestments);
router.get("/:id", investmentController.getMyInvestmentById);

module.exports = router;
