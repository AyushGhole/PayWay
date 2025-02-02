// ENV Declarations
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Declaring cloud databases
const dbUrl = process.env.ATLAS_URL;

// Requiring packages
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport"); //passport declaration
const LocalStrategy = require("passport-local"); //passport-local declaration
const paywayUser = require("./models/User"); // user model declaration
const routes = require("./routes/user");
const bankRoutes = require("./routes/bank");
const flash = require("connect-flash");

// MongoDb Store connection
const Store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

Store.on("error", (err) => {
  console.log("Error in MongoDB session store:", err);
});

// Session declarations
const sessionOptions = {
  store: Store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Fixed cookie expiration calculation
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Fixed dirname
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(paywayUser.authenticate()));
passport.serializeUser(paywayUser.serializeUser());
passport.deserializeUser(paywayUser.deserializeUser());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public"))); // Fixed dirname

// MongoDb Connection
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log("connection error", err);
  });

// Flash requirements
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Router Declaration
app.use("/main/", routes);
app.use("/main/", bankRoutes);

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080!");
});
