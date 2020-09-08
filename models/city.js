const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const citySchema = new mongoose.Schema({
  cityName: String,
  parentState:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'State',
  },
  status:{
  	type:String,
  	enum:["active","inactive"]
  }
});

function validateCity(req) {
  const schema = Joi.object({
    cityName: Joi.string().required(),
    stateName:Joi.string(),
    status: Joi.string().valid("active","inactive")
  });

  return schema.validate(req);
}

const City = mongoose.model("City", citySchema);

exports.City = City;
exports.validateCity = validateCity;
