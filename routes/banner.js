const router = require("express").Router();
const {Banner}=require("../models/banner");
const upload = require("../config/multerConfig");
const _=require('lodash')

router.get('/all',(req,res) => {
	Banner.find()
	.then((bans)=> res.send(bans))
	.catch(err=>res.status(400).send("Something went wrong!"));
})

router.post('/new',upload.single('logo'),(req, res) => {
	var reqBody=_.omit(req.body,["logo"]);
	if(!req.file) return res.status(400).send("Logo not choosen!");
	console.log(req.file)
	console.log(reqBody)
	Banner.create({
		...reqBody,
		logo:req.file.filename
	})
	.then((ban)=>{
		res.send(ban);
	})
	.catch((err)=>console.log(err));
})

router.put('/edit/:id',(req, res) => {
	Banner.findByIdAndUpdate(req.params.id,req.body,{
		new:true
	}).then((ban)=>res.send(ban))
	.catch(err => res.status(400).send("Something went wrong!"));
})

router.delete('/delete/:id',(req, res) => {
	Banner.findByIdAndRemove(req.params.id)
	.then((data)=>res.send(data))
	.catch(err => res.status(400).send("Something went wrong!"));
})


module.exports = router;