const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const stateSchema = new mongoose.Schema({
  stateName: String,
  status:{
  	type:String,
  	enum:["active","inactive"]
  }
});

function validateState(req) {
  const schema = Joi.object({
    stateName: Joi.string().required(),
    status: Joi.string().valid("active","inactive")
  });

  return schema.validate(req);
}

const State = mongoose.model("State", stateSchema);

exports.State = State;
exports.validateState = validateState;
