const mongoose = require("mongoose");
//const Joi = require("@hapi/joi");

const cancellationpolicySchema = new mongoose.Schema({
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


const Cancellationpolicy = mongoose.model("Cancellationpolicy", cancellationpolicySchema);

exports.Cancellationpolicy = Cancellationpolicy;
//exports.validatecancellationpolicy = validatecancellationpolicy;
