const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

/*View all the links*/
router.get("/", (req, res, next) => {
  Content.find()
    .then((contents) => {
      res.json(contents);
    })
    .catch((err) => {
      next(err);
    });
});

/*View the particular link*/
router.get("/:id", (req, res, next) => {
  Content.findById(req.params.id)
    .then((link) => {
      if (!link) {
        return res.json({
          status: "Unsuccessfull!",
          message: "Link does not exist",
        });
      }
      res.status(200).json(link);
    })
    .catch((err) => next(err));
});

/*Create the link*/
router.post("/create", (req, res, next) => {
  console.log(req.body);
  const { name, contentBody, displayName } = req.body;
  Content.create({ name, contentBody, displayName })
    .then(async (content) => {
      content.isActive = true;
      await content.save();
      res.json(content);
    })
    .catch((err) => next(err));
});

/*Hide unhide the link*/
router.put("/hide/:id", (req, res, next) => {
  Content.findById(req.params.id)
    .then(async (link) => {
      link.isActive = !link.isActive;
      await link.save();
      res.json(link);
    })
    .catch((err) => next(err));
});

/*Update the link*/
router.put("/update/:id", (req, res, next) => {
  Content.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((link) => {
      if (!link) {
        return res.json({
          status: "Unsuccessfull!",
          message: "Link does not exist",
        });
      }
      res.status(200).json({ status: "Successfull!", link });
    })
    .catch((err) => {
      next(err);
    });
});

/*Delete the link*/
router.delete("/delete/:id", (req, res, next) => {
  Content.findByIdAndRemove(req.params.id)
    .then((link) => {
      if (!link) {
        return res.json({
          status: "Unsuccessfull!",
          message: "Link does not exist",
        });
      }
      res.json({ status: "Successfull!", link });
    })
    .catch((err) => next(err));
});

module.exports = router;
