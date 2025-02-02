const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  complaint: {
    type: String,
  },
});

module.exports = mongoose.model("Complaint", UserSchema);
