const mongoose = require("mongoose");

const recentSchema = new mongoose.Schema({
  message:{
    type:String,
    required:true
  },
  typeof:{
    type:String
  },
  createdOn:Date
})

const RecentActivity = mongoose.model("RecentActivity", recentSchema);

exports.RecentActivity = RecentActivity;