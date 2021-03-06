const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

exports.Image = Image;
