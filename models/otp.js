var mongoose = require("mongoose");

var otpSchema = new mongoose.Schema({
  userPhoneNo: {
    type: Number,
    unique: true,
  },
  code: {
    type: String,
    default: null,
  },
  validTill: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
