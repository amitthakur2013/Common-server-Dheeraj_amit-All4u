const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const promocodeSchema = new mongoose.Schema({
  title: String,
  subTitle: String,
  icon: String,
  code: {
    type: String,
    unique: true,
  },
  discount: Number,
  discountAmount: Number,
  isUserSpecific: Boolean,
  isDealSpecific: Boolean,
  forUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
  forDeal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deal",
  },
  validFrom: Date,
  validTill: Date,
  minAmount: Number,
  maxAmount: Number,
  description: String,
  notes: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
});

const Promocode = mongoose.model("Promocode", promocodeSchema);

function validatePromocode(promocode) {
  const schema = Joi.object({
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    //icon: Joi.string(),
    code: Joi.string().required(),
    validFrom: Joi.string().required(),
    validTill: Joi.string().required(),
    isUserSpecific: Joi.boolean().required(),
    isDealSpecific: Joi.boolean().required(),
    minAmount: Joi.when("isDealSpecific", {
      is: false,
      then: Joi.number().required(),
    }),
    maxAmount: Joi.when("isDealSpecific", {
      is: false,
      then: Joi.number().required(),
    }),
    forUsers: Joi.when("isUserSpecific", {
      is: true,
      then: Joi.array().required(),
    }),
    forDeal: Joi.when("isDealSpecific", {
      is: true,
      then: Joi.objectId().required(),
    }),
    discount: Joi.number().required(),
    discountAmount: Joi.number(),
    description: Joi.string(),
    notes: Joi.string(),
    status: Joi.string().valid("active", "inactive").required(),
  });

  return schema.validate(promocode);
}

exports.Promocode = Promocode;
exports.validatePromocode = validatePromocode;
