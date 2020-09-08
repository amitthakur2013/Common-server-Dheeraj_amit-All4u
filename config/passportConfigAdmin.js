const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// *  Admin Model
const { Admin } = require("../models/admin");

module.exports = function (passport) {
  passport.use(
    "admin",
    new LocalStrategy(async (loginDetails, password, done) => {
      console.log(loginDetails);

      // Find a Admin
      let foundAdmin;
      // Check if loginDetails include "@"
      if (loginDetails.includes("@")) {
        // True -> Find by email
        foundAdmin = await Admin.findOne({ email: loginDetails }).exec();
      } else {
        // False -> Find by phoneNo
        foundAdmin = await Admin.findOne({
          phoneNo: parseInt(loginDetails),
        }).exec();
      }
      if (!foundAdmin) {
        console.log("No Admin found");
        return done(null, false, { message: "Invalid Credentials" });
      }

      if (foundAdmin.status.toLowerCase() === "inactive")
        return done(null, false, {
          message: "Your access has been restricted. Contact Admin.",
        });

      // Match Password
      bcrypt.compare(password, foundAdmin.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, foundAdmin);
        } else {
          return done(null, false, { message: "Incorrect Credentials" });
        }
      });
    })
  );

  passport.serializeUser(function (foundAdmin, done) {
    done(null, foundAdmin._id);
  });

  passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, foundAdmin) {
      done(err, foundAdmin);
    });
  });
};
