const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const adminSchema = new mongoose.Schema({
  name: String,
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
  createdOn: String,
  createdOrg: Date,
  updatedOn: String,
  role: {
    type: String,
    enum: ["admin", "merchant", "outlet", "customer"],
  },
});

function validateAdmin(admin) {
  const schema = Joi.object({
    name: Joi.string().max(150).required(),
    email: Joi.string().email().required(),
    phoneNo: Joi.string().max(10).min(10).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    status: Joi.string().required(),
  });
  return schema.validate(admin);
}

const Admin = mongoose.model("Admin", adminSchema);

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
