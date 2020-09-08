const express = require("express");
const mongoose = require("mongoose");
const {RecentActivity}=require("../models/recentActivities");

// * NPM packages
const passport = require("passport");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const _ = require("lodash");
const crypto = require("crypto");

// * Models
const { Admin, validateAdmin } = require("../models/admin");
const Joi = require("@hapi/joi");

// * Functions

// * Util

// * Middleware

// * Requests -->
const router = express.Router();

// * Get all admin
// * Done
router.get("/all", async (req, res) => {
  try {
    const admins = await Admin.find({}).sort("-createdOrg").exec();
    if (!admins) return res.send("No Admins found.");

    res.send(admins);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get single admin
// * Done
router.get("/view/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).exec();

    if (!admin) return res.send("User does not exist.");

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Create a new admin
// * Done
router.post("/new", async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error) return res.send(error.details[0].message);

    if (req.body.password.trim() !== req.body.confirmPassword)
      return res.send("Passwords do not match.");

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(req.body.password.trim(), salt);

    var reqBody = _.omit(req.body, ["password", "confirmPassword", "phoneNo"]);

    var newAdmin = {
      ...reqBody,
      phoneNo: Number(req.body.phoneNo),
      password: password,
      createdOn: moment().format("D/M/YYYY, h:m A"),
      createdOrg: new Date(),
      role: "admin",
    };

    const admin = await Admin.create(newAdmin);
    await RecentActivity.create({
      message:`New admin ${admin.name} created`,
      createdOn:new Date()
    })
    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get your profile
// * Done
router.get("/profile", async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).exec();

    if (!admin) return res.status(403).send("User does not exist.");

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Edit your profile
// * Done
router.put("/profile", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      name: Joi.string().max(150).required(),
      email: Joi.string().email().required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var admin = await Admin.findByIdAndUpdate(
      req.user._id,
      { ...req.body, updatedOn: moment().format("D/M/YYYY, h:m A") },
      {
        new: true,
      }
    ).exec();

    if (!admin) return res.status(403).send("User does not exist.");

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Edit any admin
// * Done
router.put("/edit/:id", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      name: Joi.string().max(150).required(),
      email: Joi.string().email().required(),
      phoneNo: Joi.string().min(10).max(10).required(),
      status: Joi.string().valid(["active", "inactive"]).required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var reqBody = _.omit(req.body, ["phoneNo"]);

    var admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        ...reqBody,
        phoneNo: Number(req.body.phoneNo),
        updatedOn: moment().format("D/M/YYYY, h:m A"),
      },
      { new: true }
    );

    if (!admin) return res.send("User does not exist.");

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Change password
// * Done
router.put("/change-password", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      oldPassword: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var admin = await Admin.findById(req.user._id).exec();

    if (!admin) return res.send("User does not exists.");

    var result = await bcrypt.compare(
      req.body.oldPassword.trim(),
      admin.password
    );

    if (!result) return res.send("Old password is incorrect.");

    if (req.body.password.trim() !== req.body.confirmPassword.trim())
      return res.send("Passwords do not match.");

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(req.body.password.trim(), salt);

    admin.password = password;
    admin.updatedOn = moment().format("D/M/YYYY, h:m A");

    admin = await admin.save();

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Change Status
// * Done
router.put("/change-status/:id", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      status: Joi.string().valid(["active", "inactive"]).required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var admin = await Admin.findById(req.params.id).exec();
    if (!admin) return res.send("User does not exist.");

    admin.status = req.body.status.trim().toLowerCase();
    admin.updatedOn = moment().format("D/M/YYYY, h:m A");

    admin = await admin.save();

    res.send(admin);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Login Admin
// * Done
router.post("/login", (req, res, next) => {
  passport.authenticate("admin", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
});

router.delete('/delete/:id',async (req,res)=> {
  try{
    const admin=await Admin.findByIdAndRemove(req.params.id)
  await RecentActivity.create({
      message:`Admin ${admin.name} deleted`,
      createdOn:new Date()
    })
  res.send(admin);
} catch(err){
  console.log(err);
  res.send("Something went wrong.");
}  
})

// * Requests End -->

module.exports = router;
