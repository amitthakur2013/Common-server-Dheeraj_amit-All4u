const mongoose = require("mongoose");
//const Joi = require("@hapi/joi");

const howtouseSchema = new mongoose.Schema({
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


const Howtouse = mongoose.model("Howtouse", howtouseSchema);

exports.Howtouse = Howtouse;
//exports.validatehowtouse = validatehowtouse;
