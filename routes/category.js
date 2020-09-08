// ! 3 TODOS remaining
//TODO add link to categoriees
const express = require("express");
const mongoose = require("mongoose");

const upload = require("../config/multerConfig");
// * NPM Packages

// * Models
const { Category, validateCategory } = require("../models/category");
const { Subcategory, validateSubcategory } = require("../models/subcategory");

// * Functions

// * Middleware

const router = express.Router();

// * Requests -->

// * Get all categories
// * Done
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("subcategories", "-deals")
      .exec();

    res.json({ categories });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }
});

// * Get a single category
// * Done
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("subcategories", "-deals")
      .exec();

    if (!category) {
      console.log("No Category found");
      return res.status(400).send("No category found");
    }

    res.json({ category });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }
});

// * Create a new category
// * Done
router.post("/new", upload.single("image"), async (req, res) => {
  // console.log("in create route");
  try {
    const { err } = validateCategory(req.body);
    if (err) return res.status(400).send(err.details[0].message);

    let category = await Category.findOne({
      name: req.body.name.trim(),
    }).exec();
    if (category) return res.status(400).send("Category already exists.");

    category = await Category.create({
      name: req.body.name.trim(),
      img: req.body.img,
      notes: req.body.notes.trim(),
    });

    res.json({ category });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }
});

// * Edit Category Name
// * Done
router.put("/:id", async (req, res) => {
  try {
    const { err } = validateCategory(req.body);
    if (err) return res.status(400).send(err.details[0].message);

    let category = await Category.findById(req.params.id).exec();
    if (!category) return res.status(400).send("No category found.");

    category.name = req.body.name.trim();
    category = await category.save();

    res.json({ category });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }
});

// * Add a subcategory
// TODO -> How to?
router.put("/sub/add/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id).exec();
    if (!category) return res.status(400).send("No category found");
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }
});
// router.put("/sub/add/:id", async (req, res) => {
//   try {
//     if (!req.body.subcategoryId)
//       return res.status(400).send("NO subcategory id provided in req.body");
//     let category = await Category.findById(req.params.id).exec();
//     if (!category) return res.status(400).send("No category found");
//     category.subcategories.push(req.body.subcategoryID);
//     await category.save();
//     res.send(category);
//   } catch (error) {
//     console.log("Error occured here \n", error);
//     res.status(400).send("Something went wrong.");
//   }
// });
// * Remove a subcategory
// * Done
router.put("/sub/remove/:id", async (req, res) => {
  try {
    var category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { subcategories: req.body.subId },
      },
      { new: true }
    );

    if (!category) return res.status(400).send("No Category found.");

    res.json({ category });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong");
  }
});

// * Delete a category
// TODO -> should deals also be deleted?

// * Requests End -->

module.exports = router;
