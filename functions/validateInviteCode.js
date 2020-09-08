const { InviteCode } = require("../models/inviteCode");

const validateInviteCode = async (code, phoneNo) => {
  let foundInviteCode = await InviteCode.findOne({
    code: code,
    for: phoneNo,
  }).exec();
  if (!foundInviteCode) {
    console.log("No invite found.");
    return 0;
  }

  if (foundInviteCode.validTill >= Date.now()) {
    console.log("Valid Invite Code.");
    return 2;
  } else {
    console.log("Expired.");
    return 1;
  }
};

module.exports = validateInviteCode;
