const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const enquirySchema = new mongoose.Schema({
  name: String,
  phoneNo: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  businessName: String,
  moreInfo: String,
  createdOn:String,
});

function validateEnquiry(enquiry) {
  const schema = Joi.object({
    name: Joi.string().max(150).required(),
    phoneNo: Joi.string().min(10).max(10).required(),
    email: Joi.string().email().required(),
    businessName: Joi.string().required(),
    moreInfo: Joi.string(),
  });

  return schema.validate(enquiry);
}

const Enquiry = mongoose.model("Enquiry", enquirySchema);

exports.Enquiry = Enquiry;
exports.validateEnquiry = validateEnquiry;
