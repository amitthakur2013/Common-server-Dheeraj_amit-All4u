const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
//routes
const homepage = require("./routes/homepage");
const customer = require("./routes/customer");
const merchant = require("./routes/merchant");
const admin = require("./routes/admin");
const location = require("./routes/location");
const category = require("./routes/category");
const subcategory = require("./routes/subcategory");
const deals = require("./routes/deals");
const order = require("./routes/order");
const enquiry = require("./routes/enquiry");
const promocode = require("./routes/promocode");
const content = require("./routes/content");
const image = require("./routes/imgUpload");
const invitecode = require("./routes/invitecode");
const area = require("./routes/area");
const city = require("./routes/city");
const state = require("./routes/state");
const menuTemplate = require("./routes/menuTemplate");
const howtouse = require("./routes/howtouse");
const cancellationpolicy = require("./routes/cancellationpolicy");
const thingstoremember = require("./routes/thingstoremember");
const refundpolicy = require("./routes/refundpolicy");
const banner = require("./routes/banner")

const recentActivities = require("./routes/recentActivities");
const viewpdf = require("./routes/viewpdf");

//Exception handling
//TODO Proper exception handling,resolving and logging
process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);

//online DB
mongoose
  .connect(
    "mongodb+srv://aryaman:all4you@all4you.4rsvl.mongodb.net/all4you?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(console.log("Connected to MongoDB online..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.static("public"));
app.use(express.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
      next();
  }
});

app.use(
  session({
    secret: "isse mat dekho please",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser("isse mat dekho please"));

app.use(passport.initialize());
app.use(passport.session());
// * Passport Config
// Customer
require("./config/passportConfigCustomer")(passport);
// Merchant
require("./config/passportConfigMerchant")(passport);
// Admin
require("./config/passportConfigAdmin")(passport);


app.use("/api/homepage", homepage);
app.use("/api/customer", customer);
app.use("/api/merchant", merchant);
app.use("/api/admin", admin);
app.use("/api/location", location);
app.use("/api/category", category);
app.use("/api/enquiry", enquiry);
app.use("/api/subcategory", subcategory);
app.use("/api/deal", deals);
app.use("/api/orders", order);
app.use("/api/promocode", promocode);
app.use("/api/content", content);
app.use("/api/image", image);
app.use("/api/state", state);
app.use("/api/city", city);
app.use("/api/area", area);
app.use("/api/invitecode", invitecode);

app.use("/api/menuTemplate", menuTemplate);
app.use("/api/howtouse", howtouse);
app.use("/api/cancellationpolicy", cancellationpolicy);
app.use("/api/thingstoremember", thingstoremember);
app.use("/api/refundpolicy", refundpolicy);

app.use("/api/banner", banner);

app.use("/api/recentActivities", recentActivities);
app.use("/api/viewpdf", viewpdf);

const port = process.env.PORT || 3124;
app.listen(port, console.log(`Listening on port ${port}...`));
