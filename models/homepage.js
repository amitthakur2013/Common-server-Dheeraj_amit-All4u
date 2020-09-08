const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
});

const Homepage = mongoose.model("Homepage", homepageSchema);

module.exports.Homepage = Homepage;
