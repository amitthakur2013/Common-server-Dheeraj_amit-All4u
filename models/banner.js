const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const bannerSchema= new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  bannerTitle:{
    type:String,
    required:true
  },
  bannerSubtitle:{
    type:String,
    required:true
  },
  caption:{
    type:String,
    required:true
  },
  redirectUrl:{
    type:String,
    required:true
  },
  logo:{
    type:String,
    required:true
  },
  position:{
    type:String
  },
  status:{
    type:String,
    enum:["active","inactive"]
  }
});

const Banner = mongoose.model("Banner", bannerSchema);

exports.Banner = Banner;

