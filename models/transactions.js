const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  To: {
    type: Number,
  },
  AccountHolderName: {
    type: String,
  },
  Amount: {
    type: Number,
  },
  Status: {
    type: String,
  },
});

module.exports = mongoose.model("Transactions", UserSchema);
