const router = require("express").Router();
const moment = require("moment");

const {
  Deal,
  validateDeal,
  validateactivityDeal,
  validatemovieDeal,
  validatehotelDeal,
} = require("../models/Deals");
const { Category } = require("../models/category");
const { Merchant } = require("../models/merchant");

const { RecentActivity } = require("../models/recentActivities");
const {Thingstoremember}=require("../models/thingstoremember");
const {Howtouse}=require("../models/howtouse");
const {Cancellationpolicy} = require("../models/cancellationpolicy");

// * Get all deals
// * Done
router.get("/all", async (req, res) => {
  const deals = await Deal.find();
  res.json(deals);
});

// * GET a single deal
router.get("/:id", async (req, res) => {
  // console.log(req.params);
  const deal = await Deal.findById(req.params.id);
  res.json(deal);
});

// * Get all deals of a category
// * Done
router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) return res.status(400).send("No id provided");
  const deals = await Deal.find({ category: categoryId });
  res.json(deals);
});
// * Get all deals of a merchant
// * Done
router.get("/merchant/:merchantId", async (req, res) => {
  const { merchantId } = req.params;
  if (!merchantId) return res.status(400).send("No id provided");
  const deals = await Deal.find({ merchant: merchantId }).populate("category").populate("thingstoremember").populate("howtouse").populate("cancellationpolicy").exec();
  res.json(deals);
});

/*create a new MOVIE deal*/
router.post("/new_movie",async (req, res, next) => {
  try{
    const response = validatemovieDeal(req.body);
    if (response.error) res.status(400).send(response.error.details[0].message);

    req.body.isActive = true;
    const merchant = await Merchant.findById(req.body.merchant);

    if (!merchant)
      return res.status(400).send("No merchant with the given id found");
    const deal = new Deal({
      ...req.body,
      createdOn: moment().format("D/M/YYYY, h:m A"),
    });
    /* ROW and COL for no of seats*/
   /* var seats=[]
    for(var i=0;i<req.body.row;i++){
      for (var j=1;j<=req.body.col;j++) {
        seats.push({seatno:(String.fromCharCode(65+i)+j),isavailable:true});
      }
    }
    deal.movieAvailability.map((avl)=>{
      avl.slot.map((slt)=>{
        slt.seats=seats;
      })
    })*/

    merchant.deals.push(deal._id);
    await merchant.save();
    await deal.save();
    await RecentActivity.create({
      message:`New Movie coupon created by admin under merchant ${merchant.businessName}`,
      createdOn:new Date()
    })
    res.json(deal);

  }
  catch(err) {
    console.log(err)
  }

  });

// * Create new deal (NORMAL AND ACTIVITY AND HOTEL)
// * Done
router.post("/new", (req, res, next) => {
  // console.log(req.body);
  Category.findOne({ name: req.body.category })
    .then(async (cat) => {
      // console.log(cat);

      // VALIDATION
      // if (cat.name.toString() === "Activity") {
      //   const response = validateactivityDeal(req.body);
      //   if (response.error)
      //     res.status(400).send(response.error.details[0].message);
      // } else if (cat.name.toString() === "Normal") {
      //   const response = validateDeal(req.body);
      //   if (response.error)
      //     res.status(400).send(response.error.details[0].message);
      // } else if (cat.name.toString() === "Hotel") {
      //   const response = validatehotelDeal(req.body);
      //   if (response.error)
      //     res.status(400).send(response.error.details[0].message);
      // }

      req.body.isActive = true;
      let merchant;
      try {
        // console.log(req.body.merchant);
        merchant = await Merchant.findById(req.body.merchantUser);
        // console.log(merchant);
      } catch (error) {
        console.log(error);
      }
      if (!merchant || merchant == null)
        return res.status(400).send("No merchant with the given id found");
      let datesArray = getDatesArray(req.body.validFrom, req.body.validTo);
      const deal = new Deal({
        ...req.body,
        category: cat._id,
        merchant: merchant._id,
        availability: datesArray,
        createdOn: moment().format("D/M/YYYY, h:m A"),
      });
      // console.log(datesArray);

      merchant.deals.push(deal._id);

      await merchant.save();
      await deal.save();

      //TODO apply fawn??
      await RecentActivity.create({
        message: `New Coupon created by admin under merchant ${merchant.businessName}`,
        createdOn: new Date(),
      });

      res.json(deal);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
// * set a deal  to not active
// * Done
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send("No id provided");

  const deal = await Deal.findById(id);
  if (!deal) return res.status(400).send("No deal with the given id found");
  deal.isActive = false;

  await deal.save();
  res.json(deal);
});

// * delete a deal
// * Done
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send("No id provided");

  const deal = await Deal.findByIdAndDelete(id);
  if (!deal) return res.status(400).send("No deal with the given id found");
  res.json(deal);
});

// * set deals belonging to one merchaant to not acive
// * Done
router.delete("/merchant/:merchantId", async (req, res) => {
  const { merchantId } = req.params;
  if (!merchantId) return res.status(400).send("No id provided");

  const deals = await Deal.updateMany(
    { merchant: merchantId },
    { isActive: false },
    { multi: true }
  );

  res.json(deals);
});

/*Edit a particular deal by id*/
router.put("/edit/:id", async (req, res) => {
  // console.log(typeof req.body.availability);
  const { id } = req.params;
  if (!id) return res.status(400).send("No id provided");
  Deal.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .then((deal) => res.json(deal))
    .catch((err) => re.status(400).send("Something went wrong!"));
});

// * edit a deal
// * Done
router.put("/:id", async (req, res) => {
  const { error } = validateDeal(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const { id } = req.params;
  if (!id) return res.status(400).send("No id provided");

  req.body.isActive = true;

  const deals = await Deal.updateMany({ merchant: merchantId }, req.body, {
    multi: true,
  });

  res.json(deals);
});

const getDatesArray = (start, end) => {
  let initialTime = moment(start).format();
  let endTime = moment(end).format();
  let arrTime = [];
  // console.log(initialTime);
  for (
    let q = initialTime;
    moment(q).isBefore(endTime); // q = moment().add(1, "day").format()

  ) {
    q = moment(q).add(1, "day").format();
    // console.log(moment(q).format("D/M/YYYY"));
    arrTime.push({ day: moment(q).format("D/M/YYYY"), slot: [] });
  }
  return arrTime;
};

// const getDatesArray = (start, end) => {
//   let initialTime = new Date(start),
//     endTime = new Date(end),
//     arrTime = [],
//     dayMillisec = 24 * 60 * 60 * 1000;
//   for (
//     let q = initialTime;
//     q <= endTime;
//     q = new Date(q.getTime() + dayMillisec)
//   ) {
//     arrTime.push(q);
//   }
//   return arrTime;
// };

module.exports = router;
