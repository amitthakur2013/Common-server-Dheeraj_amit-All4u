const router = require("express").Router();

const { City, validateCity } = require("../models/city");
const {State}=require("../models/state");

router.get("/all", async (req, res) => {
  const data = await City.find().populate("parentState").exec();
  res.json(data);
  //TODO add CHECK maybe?
});

router.get('/:state_name', (req, res)=> {
  State.findOne({stateName:req.params.state_name})
  .then((state)=>{
    City.find({parentState:state._id}).populate("parentState").exec()
    .then((city)=>{
      res.json(city);
    })
    .catch(err => res.status(400).send("Something went Wrong here city!!"))
  })
  .catch(err => res.status(400).send("Something went Wrong!!"))
})

router.post("/add", (req, res) => {
  const { error } = validateCity(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  State.findOne({stateName:req.body.stateName})
  .then(async (state)=>{
  	if(!state) return res.send("State not Found!");

  	try{
	  	const city=new City({cityName:req.body.cityName,parentState:state._id, status:req.body.status});
	  	await city.save();
	  	res.send(city);
	  } catch(err) {
	  	res.send("Something went Wrong!");
	  }
  })
  .catch(err => res.status(400).send("Something went Wrong!!"))

});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  //TODO validate del request

  const data = await City.findByIdAndDelete(id);
  if (!data)
    return res.status(400).send("no City with the given id found ");

  res.json(data);
});

module.exports = router;
