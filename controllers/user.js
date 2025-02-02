const paywayUser = require("../models/User");
const order = require("../models/order");
const Complaint = require("../models/complaint");
const BankDetails = require("../models/bank");

const Transaction = require("../models/transactions");
// Main Index
module.exports.index = (req, res) => {
  res.render("index.ejs");
};

// Login Route Rendering
module.exports.loginRoute = (req, res) => {
  res.render("login.ejs");
};

// Login Route Rendering
module.exports.loginRoute1 = (req, res) => {
  res.render("loginside.ejs");
};

// Post Login Route Rendering
module.exports.postLoginRoute = async (req, res) => {
  await req.flash("success", "Welcome back to Pay Way!!");
  res.redirect("/main");
};

//Sigun Route Rendering
module.exports.signUpRoute = (req, res) => {
  res.render("signup.ejs");
};

//Sigup Sidebar Route Rendering
module.exports.signUpRoute1 = (req, res) => {
  res.render("signupside.ejs");
};

// Post  SignUp Route Rendering
module.exports.postSignUpRoute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new paywayUser({ email, username });
    console.log("newUsers : ", newUser);
    const registeredUser = await paywayUser.register(newUser, password);
    console.log("Registered Users : ", registeredUser);
    req.flash("success", `${username} registered successfully!`);
    res.redirect("/main");
  } catch (err) {
    req.flash("error", err.message);
    console.log(err.message);
    res.redirect("/main/signup");
  }
};

// Credit Cards Rendering
module.exports.renderCreditCard = (req, res) => {
  res.render("credit.ejs");
};

// Debit card rendering
module.exports.renderDebitCard = (req, res) => {
  res.render("debit.ejs");
};

// User Layout After login
module.exports.renderUserLayout = async (req, res) => {
  let { id } = req.params;
  let User = await paywayUser.findById(id);
  let bank = await User.BankDetails;
  let bankKnown = await BankDetails.findById(bank[0]);
  let bankDetails = await BankDetails.findById(bank[1]);
  let trans = User.Transactions;
  let transactions = await Transaction.findById(trans);
  // console.log("trem", transactions);
  // console.log("transactions length", trans.length);
  let details = await paywayUser
    .findById(id)
    .populate({ path: "Transactions" });

  let populates = details.Transactions;
  console.log("populates", populates);
  res.render("userDashboard.ejs", {
    User,
    bank,
    bankKnown,
    bankDetails,
    transactions,
    trans,
    populates,
  });
};

// OrderProducts
module.exports.orderProducts = (req, res) => {
  res.render("orderform.ejs");
};

// Saving order details in databases
module.exports.sendOrderDetails = async (req, res) => {
  let { id } = req.params;
  let { name, email, product, address } = req.body;
  let newOrder = new order({ name, email, product, address });
  console.log("Your order is : ", newOrder);
  let User = await paywayUser.findById(id);
  console.log("Logged In User is : ", User);

  await User.order.push(newOrder);
  await User.save();
  await newOrder.save();

  req.flash("success", "Ordered saved successfully");
  res.render("receipt.ejs", { newOrder, id });
};

// Complaint rendering
module.exports.renderComplaint = (req, res) => {
  res.render("complaint.ejs");
};

// Complaint Saving
module.exports.saveComplaint = async (req, res) => {
  let { id } = req.params;
  let { username, complaint } = req.body;
  let User = await paywayUser.findById(id);
  let newComplaint = new Complaint({ username, complaint });
  console.log("Your Complaint is : ", newComplaint);
  console.log("Logged In User is : ", User);

  await User.Complaint.push(newComplaint);
  await User.save();
  await newComplaint.save();

  console.log(User);

  req.flash(
    "success",
    `Compliant saved successfully, Compliant_id : ${newComplaint.id} `
  );
  res.redirect(`/main/${User.id}/dashboard`);
};
