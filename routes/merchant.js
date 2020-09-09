const express = require("express");
const mongoose = require("mongoose");
const upload = require("../config/multerConfig");
const path = require("path");
const { RecentActivity } = require("../models/recentActivities");
//! in create new merchant -- validate merchant not working with
// * NPM Packages
const passport = require("passport");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const _ = require("lodash");
const crypto = require("crypto");
const async = require("async");

// * Models
const { Merchant, validateMerchant } = require("../models/merchant");
const {Category} = require("../models/category");
// * Functions

// * Util
const smtpTransport = require("../config/nodemailerSetup");
const router = express.Router();
const Joi = require("@hapi/joi");

// * Middleware

// * Requests -->

// * Get all merchants ( A )
// * Done
router.get("/all", async (req, res) => {
  console.log("here");
  try {
    const merchants = await Merchant.find({}).sort("-createdOrg").exec();

    if (!merchants) return res.send("No merchants found.");

    // res.send("merchants");
    res.send(merchants);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get merchant for specific category
// * Done
router.get("/:category_id", async (req, res) => {
  try {
    const merchants = await Merchant.find({
      categories: req.params.category_id,
    })
      .select(["_id", "businessName", "locationInfo", "images"])
      .exec();

    if (!merchants) return res.send("No vendors exists for this category.");

    res.send(merchants);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get a single merchant ( A )
// * Done
router.get("/view/:id", async (req, res) => {
  // console.log("here");
  try {
    const merchant = await Merchant.findById(req.params.id)
      .populate("categories")
      .exec();

    if (!merchant) return res.send("User does not exist.");

    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Create a New Merchant ( A )
// * Done
router.post("/new", async (req, res) => {
  try {
    console.log(req.body);
    // const { error } = validateMerchant(req.body);
    // if (error) return res.send(error.details[0].message);

    if (req.body.password.trim() !== req.body.confirmPassword.trim())
      return res.send("Passwords do not match.");

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(req.body.password.trim(), salt);

    var reqBody = _.omit(req.body, [
      "password",
      "confirmPassword",
      "phoneNo",
      "altNumber",
    ]);

    var newMerchant = {
      ...reqBody,
      phoneNo: Number(req.body.phoneNo),
      altNumber: Number(req.body.altNumber),
      password: password,
      createdOn: moment().format("D/M/YYYY, h:m A"),
      createdOrg: new Date(),
      role: "merchant",
    };

    const merchant = await Merchant.create(newMerchant);
    await RecentActivity.create({
      message: `New merchant ${merchant.businessName} created by admin`,
      createdOn: new Date(),
    });
    res.status(200).send(merchant);
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong.");
  }
});

// * Update Merchant ( Complete ) ( A )
// * Done
router.put("/edit/:id", async (req, res) => {
 try {
    /*var verificationSchema = Joi.object({
      businessName: Joi.string().max(150).required(),
      email: Joi.string().email().required(),
      businessInfo: Joi.object().keys({
        businessType: Joi.string().required(),
        title: Joi.string().required(),
        logo: Joi.string(),
        description: Joi.string(),
      }),
      contactInfo: Joi.object().keys({
        firstName: Joi.string().max(150).required(),
        lastName: Joi.string().max(150).required(),
        altMobile: Joi.string().min(10).max(10),
        landline: Joi.string(),
        communicationEmail: Joi.string().email().required(),
        about: Joi.string(),
      }),
      locationInfo: Joi.when("businessInfo.businessType", {
        is: "single",
        then: Joi.object().keys({
          state: Joi.string().required(),
          city: Joi.string().required(),
          area: Joi.string().required(),
          addrLine1: Joi.string().required(),
          addrLine2: Joi.string().required(),
          landmark: Joi.string().required(),
          zipcode: Joi.number().required(),
        }),
      }),
      categories: Joi.array().required(),
      images: Joi.array(),
      status: Joi.string().valid(["active", "inactive"]).required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);*/

    var merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, upadatedOn: moment().format("D/M/YYYY, h:m A") },
      {
        new: true,
      }
    ).exec();
    if (!merchant) return res.send("User does not exist.");

    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Change Status of Merchant ( A )
// * Done
router.put("/change-status/:id", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      status: Joi.string().valid(["active", "inactive"]).required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var merchant = await Merchant.findById(req.params.id).exec();

    if (!merchant) return res.send("User does not exist.");

    merchant.status = req.body.status.trim().toLowerCase();
    merchant.upadatedOn = moment().format("D/M/YYYY, h:m A");

    merchant = await merchant.save();

    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get profile ( M )
// * Done
router.get("/profile", async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.user._id).exec();

    if (!merchant) return res.send("User does not exist.");

    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Update Merchant ( Basic ) ( M )
// * Done
router.put("/profile", async (req, res) => {
  try {
    const verificationSchema = Joi.object({
      name: Joi.string().max(150).required(),
      email: Joi.string().email().required(),
    });

    const { error } = verificationSchema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    var merchant = await Merchant.findById(req.user._id).exec();

    if (!merchant) return res.send("User does not exist.");

    merchant.email = req.body.newEmail.trim();
    merchant.name = req.body.newName.trim();
    merchant.upadatedOn = moment().format("D/M/YYYY, h:m A");

    merchant = await merchant.save();

    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Change Password ( M )
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

    var merchant = await Merchant.findById(req.user._id).exec();

    if (!merchant) return res.send("User does not exists.");

    var result = await bcrypt.compare(
      req.body.oldPassword.trim(),
      merchant.password
    );

    if (!result) return res.send("Old password is incorrect.");

    if (req.body.password.trim() !== req.body.confirmPassword.trim())
      return res.send("Passwords do not match.");

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(req.body.password.trim(), salt);

    merchant.password = password;
    merchant.upadatedOn = moment().format("D/M/YYYY, h:m A");

    merchant = await merchant.save();
    await RecentActivity.create({
      message: `Merchant ${merchant.businessName} changed its password`,
      createdOn: new Date(),
    });
    res.send(merchant);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Login Merchant ( M )
router.post("/login", (req, res, next) => {
  passport.authenticate("merchant", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
});

//delete a merchant
router.delete("/delete/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndRemove(req.params.id);
    await RecentActivity.create({
      message: `Merchant ${merchant.businessName} deleted by admin`,
      createdOn: new Date(),
    });
    res.send(merchant);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong!");
  }
});
// * Requests End -->

module.exports = router;
