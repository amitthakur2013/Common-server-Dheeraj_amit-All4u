const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const dealSchema = new mongoose.Schema({
  name: String,
  //movieName: String,
  availability:[{
    day:String,
    slot:[{
      from:String,
      to:String,
      price:Number,
      qty:Number
      /*seats:[{
      seatno:String,
      isavailable:{type:Boolean,default:true}
            }]*/
    }]
  }],

  //hotel deal start
  adult:Number,
  child:Number,
  maxAdult:Number,
  maxChild:Number,
  roomQty:Number,
  meal:{
    mealtype:String,
    price:Number
  },
  extraPrice:Number,
  //hotel deal finished

  /*availability:[{
    day:String,
    slot:[{
      from:String,
      to:String,
      price:Number,
      qty:Number
    }]
  }],*/
  description: String,
  img: {
    type: String,
    required: true,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
  
  },
  commision: {
    //? also percent?? if yes also change validation
    type: Number,
    required: true,
  },
  discountPercent: Number,
  prefernceOrder: {
    type: Number,
    required: true,
  },
  Qty:Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  Subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  validOn:[{
    day:String,
    slot:String
  }],
  validFor:Number,
  valid: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  thingstoremember:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Thingstoremember"
  },
  cancellationpolicy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cancellationpolicy"
  },
  howtouse:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Howtouse"
  },
  display:{
    from:{
      type:String,
      required:true
    },
    to:{
      type:String,
      required:true
    },
  },
  location: {
    type: String,
  },
  createdOn: String,
});

function validateDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    // Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    Qty:Joi.number().required(),
    validFor:Joi.number().required(),
    validOn:Joi.array().items({
      day:Joi.string().required(),
      slot:Joi.string().required()
    }), 
    thingstoremember:Joi.objectId().required(),
    cancellationpolicy:Joi.objectId().required(),
    howtouse:Joi.objectId().required(),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validateactivityDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    availability:Joi.array().items(
      Joi.object({
        day:Joi.string().required(),
        slot:Joi.array().items(Joi.object({
        from:Joi.string().required(),
        to:Joi.string().required(),
        price:Joi.number().required(),
        qty:Joi.number().required()
        }))
      })
      ),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(), 
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    //Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validatemovieDeal(deal) {
  const schema = Joi.object({
    //movieName: Joi.string().required(),
    name:Joi.string().required(),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    availability:Joi.array().items(
      Joi.object({
        day:Joi.string().required(),
        slot:Joi.array().items(Joi.object({
        from:Joi.string().required(),
        to:Joi.string().required(),
        price:Joi.number().required(),
        qty:Joi.number().required()
        }))
      })
      ),
    // Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validatehotelDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    roomQty:Joi.number().required(),
    adult:Joi.number().required(),
    child:Joi.number().required(),
    maxAdult:Joi.number().required(),
    maxChild:Joi.number().required(),
    meal:Joi.object({
      mealtype:Joi.string(),
      price:Joi.number()
    }), 
    extraPrice:Joi.number().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

const Deal = mongoose.model("Deal", dealSchema);

exports.Deal = Deal;
exports.validateDeal= validateDeal;
//exports.validateactivityDeal = validateactivityDeal;
exports.validatemovieDeal = validatemovieDeal;
exports.validatehotelDeal=validatehotelDeal;