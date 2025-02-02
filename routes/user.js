const paywayUser = require("../models/User");
const express = require("express");
const router = express.Router();
const userscontrollers = require("../controllers/user");
let { savedRedirectUrl, isLoggedIn } = require("../middleware");
const passport = require("passport");

router.route("/").get(userscontrollers.index);

// SignUp Router
router
  .route("/signup")
  .get(userscontrollers.signUpRoute)
  .post(userscontrollers.postSignUpRoute);

// Login Router
router
  .route("/login")
  .get(userscontrollers.loginRoute)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/main/login",
      failureFlash: true,
    }),
    userscontrollers.postLoginRoute
  );

// Login Route sideBar
router
  .route("/loginPage")
  .get(userscontrollers.loginRoute1)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/main/loginPage",
      failureFlash: true,
    }),
    userscontrollers.postLoginRoute
  );

// SignUp route SideBar
router
  .route("/signupPage")
  .get(userscontrollers.signUpRoute1)
  .post(userscontrollers.postSignUpRoute);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return err;
    } else {
      req.flash("success", "User Logged out successfully!!");
      res.redirect("/main");
    }
  });
});

// User Logged In dashboard
router
  .route("/:id/dashboard")
  .get(isLoggedIn, userscontrollers.renderUserLayout);

// Complaint Route
router
  .route("/:id/complaint")
  .get(isLoggedIn, userscontrollers.renderComplaint)
  .post(userscontrollers.saveComplaint);

// Router Card
router.route("/creditCard").get(userscontrollers.renderCreditCard);
router.route("/debitCard").get(userscontrollers.renderDebitCard);

// User not logged in mandate the user to be logged in
router
  .route("/details/checked")
  .get(isLoggedIn, userscontrollers.orderProducts);

// Order Products
router
  .route("/:id/details")
  .get(isLoggedIn, userscontrollers.orderProducts)
  .post(userscontrollers.sendOrderDetails);

module.exports = router;
