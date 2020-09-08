const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
  name: String,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  credit: {
    type: Number,
    default: 0,
  },
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
  DOB: String,
  age: Number,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  resetToken: String,
  resetTokenValidity: Date,
  role: {
    type: String,
    enum: ["admin", "merchant", "outlet", "customer"],
    default: "customer",
  },
  createdOn: String,
  createdOrg: Date,
  updatedOn: String,
  signupIp: String,
  loginIp: String,
	cart:[{
    id:String,
    name:String,
    price:Number,
    qty:Number
  }]
});

function validateCustomer(customer) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    gender: Joi.string().required(),
    phoneNo: Joi.string().min(10).max(10).required(),
    DOB: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    otp: Joi.string().min(6).max(6).required(),
    credit: Joi.any(),
    // inviteCode: Joi.string().required(),
  });

  return schema.validate(customer);
}

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
