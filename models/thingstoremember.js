const mongoose = require("mongoose");
//const Joi = require("@hapi/joi");

const thingstorememberSchema = new mongoose.Schema({
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


const Thingstoremember = mongoose.model("Thingstoremember", thingstorememberSchema);

exports.Thingstoremember = Thingstoremember;
//exports.validateThingstoremember = validateThingstoremember;
