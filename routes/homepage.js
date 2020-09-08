const router = require("express").Router();
const fs = require("fs");
// const {promisify} =require('util')
const Joi = require("joi");

const upload = require("../config/multerConfig");
const { Homepage } = require("../models/homepage");
// const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const imgsData = await Homepage.find();

    res.json({ imgsData });
  } catch (error) {
    console.log("Error occured here \n", error);
    res.status(400).send("Something went wrong.");
  }

  //TODO add categories to it and locations
});

router.post("/banner/upload", upload.single("image"), async (req, res) => {
  const { error } = validateBanner(req.body);
  if (error) {
    fs.unlink(`public/uploads/${req.file.filename}`, (err) =>
      err ? console.log : ""
    );

    return res.status(400).send(error.details[0].message);
  }
  const { banner } = req.body;
  if (!req.file) return res.status(400).send("NO file");

  const data = new Homepage({
    name: req.file.filename,
    banner,
  });

  await data.save();

  return res.json(data);
});

router.delete("/banner/delete/:id", async (req, res) => {
  const { id } = req.params;
  //TODO validate del request

  const data = await Homepage.findByIdAndDelete(id);
  fs.unlink(`public/uploads/${data.name}`, (err) => (err ? console.log : ""));
  res.json(data);
});

function validateBanner(body) {
  const schema = Joi.object({
    banner: Joi.string()
      .valid("adBanner1", "adBanner2", "adBanner3", "introBanner")
      .required(),
  });
  return schema.validate(body);
}

module.exports = router;
