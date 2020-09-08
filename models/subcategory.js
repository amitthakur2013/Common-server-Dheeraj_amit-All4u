const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const subcategorySchema = new mongoose.Schema({
  name: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  deals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
  ],
});

function validateSubcategory(subcategory) {
  const schema = Joi.object({
    name: Joi.string(),
  });

  return schema.validate(subcategory);
}

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

exports.Subcategory = Subcategory;
exports.validateSubcategory = validateSubcategory;
