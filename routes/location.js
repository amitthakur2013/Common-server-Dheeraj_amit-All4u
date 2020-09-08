const router = require("express").Router();

const { Location, validateLocation } = require("../models/location");

router.get("/all", async (req, res) => {
  const data = await Location.find();
  res.json(data);
  //TODO add CHECK maybe?
});

router.post("/add", async (req, res) => {
  const { error } = validateLocation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = new Location({
    location: req.body.location,
    ofType: req.body.ofType,
  });
  await location.save();

  return res.json(location);
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  //TODO validate del request

  const data = await Location.findByIdAndDelete(id);
  if (!data)
    return res.status(400).send("no location with the given id found ");

  res.json(data);
});

module.exports = router;
