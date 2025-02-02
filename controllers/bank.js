const paywayUser = require("../models/User");
const BankDetails = require("../models/bank");
const Transaction = require("../models/transactions");

// Rendering Add Bank Details Form
module.exports.renderAddBankForm = (req, res) => {
  res.render("addBank.ejs");
};

// Saving Partial Bank Details
module.exports.addPartialBankDetails = async (req, res) => {
  let { id } = req.params;
  let { BankName, IFSC, Branch } = req.body;
  let addBank = new BankDetails({ BankName, IFSC, Branch });
  let User = await paywayUser.findById(id);

  await User.BankDetails.push(addBank);
  await User.save();
  await addBank.save();

  res.render("addDebit.ejs");
};

// Adding Remaining Bank Details
module.exports.addBankDetails = async (req, res) => {
  let { id } = req.params;
  let { DebitCard, AccountNumber, Amount } = req.body;
  let addBank = new BankDetails({ DebitCard, AccountNumber, Amount });
  let User = await paywayUser.findById(id);

  await User.BankDetails.push(addBank);
  await User.save();
  await addBank.save();
  res.redirect(`/main/${id}/dashboard`);
};

// Rendering Payment Method
module.exports.renderPaymentMethod = async (req, res) => {
  let { id } = req.params;
  let User = await paywayUser.findById(id);
  let bank = await User.BankDetails;
  let bankKnown = await BankDetails.findById(bank[0]);
  let bankDetails = await BankDetails.findById(bank[1]);
  console.log("Bank Details[0]", bankKnown);
  console.log("Bank Details[1]", bankDetails);
  console.log(bank.length);
  res.render("paymentMethodDisplay.ejs", {
    bank,
    bankKnown,
    bankDetails,
    id,
  });
};

// Rendering Payment page
module.exports.renderPaymentPage = (req, res) => {
  res.render("paymentPage.ejs");
};

// Saving details
module.exports.saveDetails = async (req, res) => {
  let { id } = req.params;
  let User = await paywayUser.findById(id);
  let { To, AccountHolderName, Amount } = req.body;
  let transactions = new Transaction({ To, AccountHolderName, Amount });
  let account = await User.BankDetails;
  console.log(account);
  let bankDetails = await BankDetails.findById(account[1]);
  console.log(bankDetails);
  console.log(transactions);
  await User.Transactions.push(transactions);
  await User.save();
  await transactions.save();
  res.render("verifyDetails.ejs", { bankDetails, transactions, User, id });
};

// edit details
module.exports.editTransactions = async (req, res) => {
  let { id } = req.params;
  let User = await paywayUser.findById(id);
  let account = await User.BankDetails;
  let amount = await BankDetails.findById(account[1]);
  let trans = await User.Transactions;
  let transactions = await Transaction.findById(trans);
  console.log("User Transactions Details : ", amount);
  console.log("transactions details :", transactions);

  if (amount.Amount > transactions.Amount) {
    amount.Amount = amount.Amount - transactions.Amount;
    await amount.save();
    console.log("Updated Bank Details : ", amount);
    transactions.Status = "success";
    await transactions.save();
    console.log("Updated transactions :", transactions);
  } else {
    transactions.Status = "failed";
    await transactions.save();
  }

  res.render("transactionReceipt.ejs", { amount, transactions, id });
};
