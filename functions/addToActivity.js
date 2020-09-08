const Activity = require("../models/activity");

const addToActivity = async (userId, statement) => {
  await Activity.create({
    user: userId,
    activity: statement,
  });
};

module.exports = addToActivity;
