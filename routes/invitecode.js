const router = require("express").Router();
const {InviteCode}=require("../models/inviteCode");
const _=require('lodash');

router.get('/all', (req, res)=> {
	InviteCode.find()
	.then((codes)=>{
		res.send(codes);
	})
	.catch((err) => res.send("Something went wrong!"));

})

router.post('/new',(req,res) => {
	var reqBody = _.omit(req.body, [
      "validTill",
    ]);

	InviteCode.create({
		...reqBody,
		validTill:new Date(req.body.validTill.toString())
	})
	.then((cd)=>res.send(cd))
	.catch((err)=>res.send('Something Went wrong!'));
})






module.exports = router;