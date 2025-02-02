const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  Complaint: [
    {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  BankDetails: [
    {
      type: Schema.Types.ObjectId,
      ref: "BankDetails",
    },
  ],
  Transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transactions",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("paywayUser", UserSchema);
