const router = require("express").Router();
const fs = require("fs");
// const {promisify} =require('util')
const Joi = require("joi");

const upload = require("../config/multerConfig");

const { Image } = require("../models/Image");
const { ImageArray } = require("../models/Images");

// Get all Images
router.get("/all", async (req, res) => {
  // console.log("hi");
  fs.readdir("./public/uploads", (err, files) => {
    // console.log(files);
    return res.json(files);
  });
  // console.log(images);
});

router.post("/upload", upload.single("image"), async (req, res) => {
  // const { error } = validateBanner(req.body);
  //   if (error) {
  //     fs.unlink(`public/uploads/${req.file.filename}`, (err) =>
  //       err ? console.log : ""
  //     );
  //     return res.status(400).send(error.details[0].message);
  //   }
  if (!req.file) return res.status(400).send("NO file");

  const data = new Image({
    name: req.file.filename,
  });

  await data.save();

  return res.json(data);
});

router.post("/multi", upload.array("images", 10), async (req, res) => {
  // const { error } = validateBanner(req.body);
  //   if (error) {
  //     fs.unlink(`public/uploads/${req.file.filename}`, (err) =>
  //       err ? console.log : ""
  //     );
  //     return res.status(400).send(error.details[0].message);
  //   }
  // if (!req.files) return res.status(400).send("NO file");

  // console.log(req.body);
  // console.log(req.files);
  let names = [];
  req.files.forEach((img) => {
    names.push(img.filename);
  });
  console.log(names);
  const data = new ImageArray({
    title: req.body.title,
    names: names,
  });

  console.log(data);

  await data.save();

  return res.json(data);
});

module.exports = router;
