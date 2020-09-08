const router = require("express").Router();

const { RecentActivity } = require("../models/recentActivities");

router.get("/all", (req, res) => {
  RecentActivity.find({})
    .sort("-createdOn")
    .exec()
    .then((acts) => {
      res.send(acts);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
