// * NPM packages
const nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sanjeevthakur2013@gmail.com",
    pass: "*********",
  },
});

module.exports = smtpTransport;
