const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  BankName: {
    type: String,
  },
  IFSC: {
    type: String,
  },
  AccountNumber: {
    type: Number,
  },
  DebitCard: {
    type: Number,
  },
  Branch: {
    type: String,
  },
  Amount: {
    type: Number,
  },
});

module.exports = mongoose.model("BankDetails", UserSchema);
