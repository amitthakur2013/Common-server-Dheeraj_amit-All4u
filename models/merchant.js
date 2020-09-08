const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const merchantSchema = new mongoose.Schema({
  businessName: String,
  email: {
    type: String,
    unique: true,
  },
  phoneNo: {
    type: Number,
    unique: true,
  },
  password: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  businessInfo: {
    businessType: {
      type: String,
      enum: ["single", "multi"],
    },
    title: String,
    logo: String,
    description: String,
  },
  contactInfo: {
    firstName: String,
    lastName: String,
    altMobile: Number,
    landline: Number,
    communicationEmail: String,
    about: String,
  },
  locationInfo: {
    state: String,
    city: String,
    area: String,
    addrLine1: String,
    addrLine2: String,
    landmark: String,
    zipcode: Number,
  },
  images: [String],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  outlets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant", // ! <-- Ask Rishabh
    },
  ],
  deals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
  ],
  createdOn: String,
  createdOrg: Date,
  updatedOn: String,
  role: {
    type: String,
    enum: ["admin", "merchant", "outlet", "customer"],
  },
});

function validateMerchant(merchant) {
  const schema = Joi.object({
    businessName: Joi.string().max(150).required(),
    // email: Joi.string().email().required(),
    // phoneNo: Joi.string().max(10).min(10).required(),
    // password: Joi.string().required(),
    // confirmPassword: Joi.string().required(),
    // status: Joi.string().valid("active", "inactive").required(),
    // businessInfo: Joi.object()
    //   .keys({
    //     businessType: Joi.string().valid("single", "multi").required(),
    //     title: Joi.string().required(),
    //     logo: Joi.string(),
    //     description: Joi.string(),
    //   })
    //   .required(),
    // contactInfo: Joi.object()
    //   .keys({
    //     firstName: Joi.string().max(150).required(),
    //     lastName: Joi.string().max(150).required(),
    //     altMobile: Joi.string().min(10).max(10),
    //     landline: Joi.string(),
    //     communicationEmail: Joi.string().email().required(),
    //     about: Joi.string(),
    //   })
    //   .required(),
    // locationInfo: Joi.when("businessInfo.businessType", {
    //   is: "single",
    //   then: Joi.object()
    //     .keys({
    //       state: Joi.string().required(),
    //       city: Joi.string().required(),
    //       area: Joi.string().required(),
    //       addrLine1: Joi.string().required(),
    //       addrLine2: Joi.string().required(),
    //       landmark: Joi.string().required(),
    //       zipcode: Joi.number().required(),
    //     })
    //     .required(),
    // }),
    // images: Joi.array(),
    // categories: Joi.array().required(),
    // subcategories: Joi.array().required(),
  });

  return schema.validate(merchant);
}

const Merchant = mongoose.model("Merchant", merchantSchema);

exports.Merchant = Merchant;
exports.validateMerchant = validateMerchant;
