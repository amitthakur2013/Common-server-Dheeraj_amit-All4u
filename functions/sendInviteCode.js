const InviteCode = require("../models/inviteCode");
const { Customer } = require("../models/customer");
const randomize = require("randomatic");
const sendText = require("./sendText");

const sendInviteCode = async (receiver, user) => {
  const customer = await Customer.findOne({ phoneNo: Number(receiver) }).exec();
  if (customer) {
    console.log("Customer already exists.");
    return 0;
  }
  var newCode = randomize("Aa0", 8).toString();
  var newInviteCode = await InviteCode.create({
    code: newCode,
    validTill: Date.now() + 2 * 24 * 60 * 60 * 1000, // <- 2 days
    for: Number(receiver),
    from: {
      name: user.name,
      phoneNo: user.phoneNo,
    },
  });

  await sendText(
    receiver.toString(),
    `Your friend ${user.name} invited you to All4You. Here's your invite code ${newCode}`
  );

  console.log(newCode);
  return 1;
};

module.exports = sendInviteCode;
