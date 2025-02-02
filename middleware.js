const paywayUser = require("./models/User");

// Logged In Authentication declarations
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    console.log("First Function :", req.session.redirectUrl);
    req.flash("error", "You need to be logged in!!");
    return res.redirect("/main");
  } else {
    next();
  }
};

// Redirect Url Declaration
module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("url", res.locals.redirectUrl);
  } else {
    next();
  }
};
