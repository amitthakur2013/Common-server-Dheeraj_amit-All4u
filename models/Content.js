const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  contentBody: {
    type: String,
    required: true,
  },
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
