const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// *  Merchant Model
const { Merchant } = require("../models/merchant");

module.exports = function (passport) {
  passport.use(
    "merchant",
    new LocalStrategy(async (loginDetails, password, done) => {
      console.log(loginDetails);

      // Find a Merchant
      let foundMerchant;
      // Check if loginDetails include "@"
      if (loginDetails.includes("@")) {
        // True -> Find by email
        foundMerchant = await Merchant.findOne({ email: loginDetails }).exec();
      } else {
        // False -> Find by phoneNo
        foundMerchant = await Merchant.findOne({
          phoneNo: parseInt(loginDetails),
        }).exec();
      }
      if (!foundMerchant) {
        console.log("No Merchant found");
        return done(null, false, { message: "Invalid Credentials" });
      }

      if (foundMerchant.status.toLowerCase() === "inactive")
        return done(null, false, {
          message: "Your access has been restricted. Contact Admin.",
        });

      // Match Password
      bcrypt.compare(password, foundMerchant.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, foundMerchant);
        } else {
          return done(null, false, { message: "Incorrect Credentials" });
        }
      });
    })
  );

  passport.serializeUser(function (foundMerchant, done) {
    done(null, foundMerchant._id);
  });

  passport.deserializeUser(function (id, done) {
    Merchant.findById(id, function (err, foundMerchant) {
      done(err, foundMerchant);
    });
  });
};
