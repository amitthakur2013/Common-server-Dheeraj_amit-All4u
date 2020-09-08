const OTP = require("../models/otp");
const { Customer } = require("../models/customer");
const randomize = require("randomatic");
const sendText = require("./sendText");

const sendOtp = async (phoneNo) => {
  const customer = await Customer.findOne({ phoneNo: phoneNo }).exec();
  if (customer) {
    console.log("Customer Exists");
    return false;
  } else {
    let otp = await OTP.findOne({ userPhoneNo: phoneNo }).exec();
    if (otp) {
      const modifiedCode = randomize("0", 6).toString();
      otp.code = modifiedCode;
      otp.validTill = Date.now() + 10 * 60 * 1000; // <-- 10 mins
      await otp.save();

      sendText(
        phoneNo,
        `Welcome to All4You! Here is your OTP for verification:- ${modifiedCode}`
      );
    } else {
      const newCode = randomize("0", 6).toString();
      let newOtp = await OTP.create({
        userPhoneNo: phoneNo,
        code: newCode,
        validTill: Date.now() + 10 * 60 * 1000, // <-- 10 mins
      });

      sendText(
        phoneNo,
        `Welcome to All4You! Here is your OTP for verification:- ${newCode}`
      );
    }
  }
};

module.exports = sendOtp;
