const mongoose = require("mongoose");
//const Joi = require("@hapi/joi");

const menuTemplateSchema = new mongoose.Schema({
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


const MenuTemplate = mongoose.model("MenuTemplate", menuTemplateSchema);

exports.MenuTemplate = MenuTemplate;
//exports.validatemenuTemplate = validatemenuTemplate;
