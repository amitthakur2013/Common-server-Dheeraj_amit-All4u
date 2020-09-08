var mongoose = require("mongoose");
const moment = require("moment");

var activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  activity: String,
  date: {
    type: String,
    default: moment().format("D/M/YYYY, h:m A"),
  },
  dateOrg: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Activity", activitySchema);
