const bankConrollers = require("../controllers/bank");
const { isLoggedIn } = require("../middleware");
const paywayUser = require("../models/User");
const express = require("express");
const router = express.Router();
const userscontrollers = require("../controllers/user");
const passport = require("passport");

// Rendering Bank Details
router
  .route("/:id/add_bank")
  .get(isLoggedIn, bankConrollers.renderAddBankForm)
  .post(bankConrollers.addPartialBankDetails);

// Rendering and Saving partial data of bank details
router.route("/:id").post(bankConrollers.addBankDetails);

// Declaration for the payment methods
router.route("/:id/payment_method").get(bankConrollers.renderPaymentMethod);

// Rendering Payment Page
router
  .route("/:id/payMoney")
  .get(bankConrollers.renderPaymentPage)
  .post(bankConrollers.saveDetails)
  .patch(bankConrollers.editTransactions);

module.exports = router;
