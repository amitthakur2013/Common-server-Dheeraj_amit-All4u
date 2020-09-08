const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const areaSchema = new mongoose.Schema({
  areaName: String,
  parentCity:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'City'
  },
  status:{
  	type:String,
  	enum:["active","inactive"]
  }
});

function validateArea(req) {
  const schema = Joi.object({
    areaName: Joi.string().required(),
    cityName:Joi.string(),
    status: Joi.string().valid("active","inactive")
  });

  return schema.validate(req);
}

const Area = mongoose.model("Area", areaSchema);

exports.Area = Area;
exports.validateArea = validateArea;
