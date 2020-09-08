const express = require("express");
const mongoose = require("mongoose");
const {RecentActivity}=require("../models/recentActivities");

// * NPM Packages
const passport = require("passport");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const _ = require("lodash");
const crypto = require("crypto");
const async = require("async");

// * Models
const { Customer, validateCustomer } = require("../models/customer");

// * Functions
const sendOtp = require("../functions/sendOtp");
const validateOtp = require("../functions/validateOtp");
const sendInviteCode = require("../functions/sendInviteCode");
const validateInviteCode = require("../functions/validateInviteCode");
const sendEmail=require("../functions/sendEmail");

// * Util
const smtpTransport = require("../config/nodemailerSetup");

// * Middleware

const router = express.Router();

// * Requests -->
// Get all users
router.get("/all", async (req, res) => {
  try {
    const users = await Customer.find();
    // console.log(users);
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// Get all users
/*
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Customer.findById(id);
    // console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});*/

// Add Credit
router.post("/add-credit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const amount = parseInt(req.body.amount);
    const user = await Customer.findById(id);
    console.log(typeof user.credit);
    user.credit = user.credit + amount;
    console.log(amount);
    console.log(user);
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// * Send OTP for register
router.post("/sendOTP", async (req, res) => {
  try {
    // send otp
    const result = await sendOtp(Number(req.body.phoneNo));
    res.send("OTP sent to " + req.body.phoneNo);
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Register Customer
router.post("/signup", async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) return res.send(error.details[0].message);

    let customer = await Customer.findOne({
      phoneNo: Number(req.body.phoneNo),
    });
    if (customer) return res.send("User already exists.");

    // validate age
    var DOB = moment(new Date(req.body.DOB)).format("D/M/YYYY");
    var age = moment().diff(moment(DOB, "D/M/YYYY"), "years");
    age = Number(age);
    if (age < 18)
      return res.send("Age must be 18 years or older.about-content");

    // validate otp
    const result = await validateOtp(
      Number(req.body.phoneNo),
      req.body.otp.trim()
    );

    if (!result) return res.send("Invalid OTP.");

    // validate invite code
    // var inviteResult = await validateInviteCode(
    //   req.body.inviteCode.trim(),
    //   Number(req.body.phoneNo)
    // );

    // if (inviteResult === 0) {
    //   return res.send("No invite found.");
    // } else if (inviteResult === 1) {
    //   return res.send("Invitation has expired.");
    // }

    // check password and confirm password
    if (req.body.password.trim() !== req.body.confirmPassword.trim())
      return res.send("Passwords do not match.");

    // hash the password
    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(req.body.password.trim(), salt);

    customer = await Customer.create({
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phoneNo: Number(req.body.phoneNo),
      password: password,
      gender: req.body.gender.trim().toLowerCase(),
      DOB: DOB,
      age: age,
      createdOn: moment().format("D/M/YYYY, h:m A"),
      createdOrg: new Date(),
    });
    await RecentActivity.create({
      message:`New user ${customer.name} registered`,
      createdOn:new Date()
    })
    res.json({ customer, message: "New Customer created" });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Login Customer
router.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("customer",(err, user, info) =>{
      if(err) return res.status(400).send("Something went Wrong!");
        if(!user){
          res.status(401).send("No user Exist!");
        } else {

          req.logIn(user,err=>{
            if(err) return res.send("Something went wrong!");

            res.send(req.user);
          })
        }
    })(req, res, next);
});

router.get('/logout', (req, res)=>{
  req.logout();
  return res.clearCookie('connect.sid').status(200).json("logged out success!!")
});

// * Get my profile
router.get("/my-account", async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).exec();
    if (!customer) return res.send("Customer does not exist.");

    res.json({ customer });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Edit Profile
router.put("/my-account", async (req, res) => {
  try {
    var customer = await Customer.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name.trim(),
        // email: req.body.email.trim(),
      },
      { new: true }
    );
    if (!customer) return res.send("Customer doesnot exist.");

    res.send(customer);
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Change Password
router.put("/changePassword", async (req, res) => {
  try {
    var customer = await Customer.findById(req.user._id).exec();
    if (!customer) return res.send("No customer exists.");

    // validate old password
    var result = await bcrypt.compare(
      req.body.oldPassword.trim(),
      customer.password
    );
    if (!result) return res.send("Old Password is incorrect.");

    // Check if password === confirmPassword
    if (req.body.newPassword.trim() !== req.body.confirmPassword.trim())
      return res.send("Passwords do not match.");

    // Change password
    var salt = await bcrypt.genSalt(10);
    var newPassword = await bcrypt.hash(req.body.newPassword.trim(), salt);
    customer.password = newPassword;
    customer = await customer.save();
    await RecentActivity.create({
      message:`User ${customer.name} changed ${customer.gender === 'male'?"his":"her"} password`,
      createdOn:new Date()
    })
    res.json({ customer, message: "Password Updated Successfully !" });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Forgot password ( Send Link to Email )
router.post("/forgot-password", async (req, res) => {
  try {
    var customer = await Customer.findOne({
      email: req.body.email.trim(),
    }).exec();
    if (!customer) return res.send("No user with this email.");

   /* var token = "";
    crypto.randomBytes(20, (err, buffer) => {
      token = buffer.toString("hex");
    });*/
  
    customer.resetToken=customer._id+customer._id;
    customer.resetTokenValidity = Date.now() + 15 * 60 * 1000; // <-- 15 mins

    customer = await customer.save();
    sendEmail(customer.email,"Reset-Password",
      `You are receiving this because you (or someone else)
        have requested the reset of the password for your account.
        Please click on the following link, or copy and paste it
        into your browser to complete the process:
        http://localhost:3000/reset/${customer.resetToken}
        If you did not request this, please ignore this email and
        your password will remain unchanged.`.replace(/       /g, '')
      );
    //console.log(customer);
    res.send(`Please check your mail( ${req.body.email} ) for further process`);
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong.");
  }
});

// * Forgot password ( Enter new password )
router.post("/forgot_password/:token", async (req, res) => {
  try {
    if ((req.body.newPassword.trim() !== req.body.confirmPassword.trim())) {
      return res.send("Passwords do not match.");
    }
    //console.log(req.params.token);
    /*var customer = await Customer.findOne({
      resetToken: req.params.token,
      resetTokenValidity: { $gt: Date.now() },
    }).exec();*/
    var customer=await Customer.findOne({
      $and:[
        {resetToken:req.params.token},
        {resetTokenValidity:{$gte: new Date()}}
      ]
    }).exec();

    if (!customer) return res.send("Reset link is invalid.");

    var salt = await bcrypt.genSalt(10);
    var newPassword = await bcrypt.hash(req.body.newPassword.trim(), salt);

    customer.password = newPassword;

    customer = await customer.save();
    sendEmail(customer.email,"Reset-Password-Success",
      `Your password Reset was Successfull, if 
       it was not you just revert back to same 
       email.
       
       Thanking You,
       Team All4You
        `.replace(/       /g, '')
      );
    res.json({ customer, message: "Password Changed." });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.send("Something went wrong");
  }
});

// * Invite a friend
router.post("/invite", async (req, res) => {
  const result = await sendInviteCode(
    Number(req.body.friend),
    _.pick(req.user, ["name", "phoneNo"])
  );
  if (result === 0)
    return res.send("Your friend is already a member of All4You.");

  res.send(`Invitation send to ${req.body.friend}`);
});

router.post("/cart/:id",(req, res) => {
  Customer.findById(req.params.id)
  .then(async (cust)=>{
    cust.cart=req.body.cartDetails
    await cust.save()
    res.send(cust);
  })
  .catch(err=>console.log(err))
})

router.get("/cart/:id",(req,res)=>{
  Customer.findById(req.params.id)
  .then((cust)=>{
    res.send(cust.cart);
  })
  .catch(err=>console.log(err))
})

router.delete("/cart/:id",(req,res)=>{
  Customer.findById(req.params.id)
  .then(async (cust)=>{
    cust.cart=[];
    await cust.save();
    res.send(cust);
  })
  .catch(err=>console.log(err))
})

// * Requests End -->

module.exports = router;
