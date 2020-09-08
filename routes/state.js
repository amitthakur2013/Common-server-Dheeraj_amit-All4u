const router = require("express").Router();

const { State, validateState } = require("../models/state");

router.get("/all", async (req, res) => {
  const data = await State.find();
  res.json(data);
  //TODO add CHECK maybe?
});

router.post("/add", (req, res) => {
  const { error } = validateState(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  State.create(req.body)
  .then((state)=> res.send(state))
  .catch((err) => res.status(400).send("Something went wrong!"))
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  //TODO validate del request

  const data = await State.findByIdAndDelete(id);
  if (!data)
    return res.status(400).send("no State with the given id found ");

  res.json(data);
});

module.exports = router;
