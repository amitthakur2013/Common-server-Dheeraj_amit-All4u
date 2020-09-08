const mongoose = require("mongoose");

const imageArraySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // unique: true,
  },
  names: [
    {
      type: String,
    },
  ],
});

const ImageArray = mongoose.model("ImageArray", imageArraySchema);

exports.ImageArray = ImageArray;
