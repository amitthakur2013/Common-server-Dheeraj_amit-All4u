const express = require("express");
const upload = require("../config/multerConfig");
const fs = require("fs");
const path=require('path');
// * NPM Packages
const _ = require("lodash");

// * Models
const { Promocode, validatePromocode } = require("../models/promocode");
const { Order } = require("../models/orders");

// * Functions
const dealExists = async (cart, dealId) => {
  var index = 0;
  for (var item of cart) {
    index++;
    if (item.deal.trim() === dealId.valueOf().toString())
      return { bool: true, index };
  }
  return { bool: false, index: null };
};

// * Middleware

// * Requests -->

const router = express.Router();

// * Get all Promocodes
// * Done
router.get("/all", async (req, res) => {
  try {
    var promocode = await Promocode.find({}).exec();
    if (!promocode) return res.send("No promocodes found.");

    res.send(promocode);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get a single promocode
// * Done
router.get("/view/:id", async (req, res) => {
  try {
    var promocode = await Promocode.findById(req.params.id)
      .populate("forDeals, forUsers")
      .exec();
    if (!promocode) return res.send("No promocodes found.");

    res.send(promocode);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Create new Promocode
// * Done
router.post("/new", upload.single("icon"),async (req, res) => {
  try {
    const { error } = validatePromocode(req.body);
    if (error) return res.send(error.details[0].message);

    var reqBody = _.omit(req.body, ["validFrom", "validTill","icon"]);

    if (!req.file) return res.status(400).send("NO file");

    //a=req.body.validFrom.toString().split("-")
    //b=req.body.validTill.toString().split("-")
    var newPromocode = await Promocode.create({
      ...reqBody,
      icon:path.join(__dirname,'../',req.file.path),
      validFrom: new Date(req.body.validFrom.toString()),
      validTill: new Date(req.body.validTill.toString()),
    });

    res.send(newPromocode);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Edit a promocode
// * Done
router.put("/edit/:id", async (req, res) => {
  try {
    const { error } = validatePromocode(req.body);
    if (error) return res.send(error.details[0].message);

    var reqBody = _.omit(req.body, ["validFrom", "validTill"]);

    var updatedPromocode = await Promocode.findByIdAndUpdate(
      req.params.id,
      {
        ...reqBody,
        validFrom: new Date(req.body.validFrom.toString()),
        validTill: new Date(req.body.validTill.toString()),
      },
      { new: true }
    );

    res.send(updatedPromocode);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Delete a promocode
router.delete("/delete/:id", async (req, res) => {
  try {
    var promocode = await Promocode.findByIdAndRemove(req.params.id).exec();

    res.send(promocode);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Apply promocode
// * Done
router.post("/apply", async (req, res) => {
  /*
    req.body => 
    cart: [
      { 
        deal: _id, 
        merchant: _id, 
        customer: _id,
        price: number, 
        promocode: String, 
        discountedPrice: Number
      }
    ]
    totalPrice: Number,
    code: String
  */

  try {
    var promocode = await Promocode.findOne({
      code: req.body.code.trim(),
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() },
    });

    if (!promocode) return res.send("Promocode is invalid or has expired.");

    if (
      promocode.isUserSpecific === true &&
      promocode.forUsers.includes(req.body.customer) === false
    )
      return res.send("Promocode is invalid.");

    if (
      promocode.isUserSpecific === false ||
      (promocode.isUserSpecific === true &&
        promocode.forUsers.includes(req.body.customer) === true)
    ) {
      if (promocode.isDealSpecific === false) {
        if (
          Number(req.body.totalPrice) >= promocode.minAmount &&
          Number(req.body.totalPrice) <= promocode.maxAmount
        ) {
          for (var item of req.body.cart) {
            var promocodeDiscount =
              Number(item.price) * (Number(promocode.discount) / 100);
            item.promocode = promocode.code.trim();
            item.discountedPrice = item.price - promocodeDiscount;
          }
          return res.json({
            message: "Promocode applied successfully.",
            object: req.body,
          });
        } else {
          if (Number(req.body.totalPrice) > Number(promocode.maxAmount)) {
            return res.send(
              "Cart value exceeds the permited value of promocode"
            );
          } else if (
            Number(req.body.totalPrice) < Number(promocode.minAmount)
          ) {
            return res.send(
              "Cart value is less than the permited value for promocode."
            );
          }
        }
      }

      if (promocode.isDealSpecific === true) {
        var ifDealExists = await dealExists(req.body.cart, promocode.forDeal);
        if (ifDealExists.bool === false) {
          return res.send("Promocode is invalid.");
        } else if (ifDealExists.bool === true) {
          req.body.cart[ifDealExists.index].promocode = promocode.code;
          req.body.cart[ifDealExists.index].discountedPrice =
            req.body.cart[ifDealExists.index].price -
            (req.body.cart[ifDealExists.index].price * promocode.discount) /
              100;

          return res.json({
            message: "Promocode applied successfully.",
            object: req.body,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Remove promocode
// * Done
router.post("/remove", async (req, res) => {
  try {
    for (var item of req.body.cart) {
      item.promocode = null;
      item.discountedPrice = item.price;
    }

    res.json({ message: "Promocode applied successfully.", object: req.body });
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Requests End -->

module.exports = router;
