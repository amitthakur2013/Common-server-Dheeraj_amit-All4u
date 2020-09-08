const mongoose = require("mongoose");
//const Joi = require("@hapi/joi");

const refundpolicySchema = new mongoose.Schema({
  title:String,
  info:String,
  isDefault:{
  	type:String,
  	enum:["Yes", "No"]
  },
  status:{
  	type:String,
  	enum:["active", "inactive"]
  }
});


const Refundpolicy = mongoose.model("Refundpolicy", refundpolicySchema);

exports.Refundpolicy = Refundpolicy;
//exports.validateRefundpolicy = validateRefundpolicy;
