const OTP = require("../models/otp");

const validateOtp = async (phoneNo, inputCode) => {
  let foundOtp = await OTP.findOne({
    code: inputCode.toString(),
    validTill: { $gt: Date.now() },
  }).exec();
  console.log(foundOtp);
  if (!foundOtp) {
    console.log("No otp found");
    return false;
  } else {
    console.log(foundOtp);
    if (parseInt(foundOtp.userPhoneNo) === parseInt(phoneNo)) {
      console.log("Valid otp");
      return true;
    } else {
      console.log("Invalid otp");
      return false;
    }
  }
};

module.exports = validateOtp;
