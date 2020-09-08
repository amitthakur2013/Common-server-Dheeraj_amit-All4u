const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// *  Customer Model
const { Customer } = require("../models/customer");

module.exports = function (passport) {
  passport.use(
    "customer",
    new LocalStrategy(async (username, password, done) => {

      // Find a Customer
      let foundCustomer;
      // Check if loginDetails include "@"
      if (username.includes("@")) {
        // True -> Find by email
        foundCustomer = await Customer.findOne({ email: username }).exec();
      } else {
        // False -> Find by phoneNo
        foundCustomer = await Customer.findOne({
          phoneNo: parseInt(username),
        }).exec();
      }
      if (!foundCustomer) {
        console.log("No customer found");
        return done(null, false, { message: "Invalid Credentials" });
      }

      /*if (foundCustomer.status.toLowerCase() === "inactive")
        return done(null, false, {
          message: "Your access has been restricted. Contact Admin.",
        });*/

      // Match Password
      bcrypt.compare(password, foundCustomer.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, foundCustomer);
        } else {
          return done(null, false, { message: "Incorrect Credentials" });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    Customer.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
