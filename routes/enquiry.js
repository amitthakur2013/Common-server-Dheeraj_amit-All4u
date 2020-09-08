const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
// * NPM Packages
const bcrypt = require("bcryptjs");
const _ = require("lodash");

// * Models
const { Enquiry, validateEnquiry } = require("../models/enquiry");

// * Functions

// * Middleware

// * Requests -->

const router = express.Router();

// * New enquiry
// * Done
router.post("/new", async (req, res) => {
  try {
    const { error } = validateEnquiry(req.body);
    if (error) return res.send(error.details[0].message);

    var reqBody = _.omit(req.body, ["phoneNo"]);

    const enquiry = await Enquiry.create({
      ...reqBody,
      createdOn:moment(new Date()).format('LLLL'),
      phoneNo: Number(req.body.phoneNo),
    });

    res.send(enquiry);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get all enquiries
// * Done
router.get("/all", async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).exec();
    if (!enquiries) return res.send("Enquiries does not exist.");

    res.send(enquiries);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get a single enquiry
// * Done
router.get("/view/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).exec();
    if (!enquiry) return res.send("Enquiry does not exist.");

    res.send(enquiry);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Delete enquiry
// * Done
router.delete("/delete/:id", async (req, res) => {
  try {
    var enquiry = await Enquiry.findByIdAndRemove(req.params.id).exec();

    if (!enquiry) return res.send("Enquiry does not exist.");

    res.send(enquiry);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Requests End -->

module.exports = router;
