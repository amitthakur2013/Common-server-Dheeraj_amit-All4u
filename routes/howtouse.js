const router = require("express").Router();

const { Howtouse } = require("../models/howtouse");

router.get('/all',(req, res) => {
Howtouse.find()
.then((menu) => {
  res.send(menu);
})
.catch(err => res.status(400).send('Something went wrong!'))
})

router.post('/new',(req, res) => {
  Howtouse.create(req.body)
  .then((menu) => {
    res.send(menu);
  })
  .catch(err => res.status(400).send('Something went wrong!'))
})

router.put("/edit/:id",async (req, res) => {
  try{
   const menu=await Howtouse.findByIdAndUpdate(req.params.id,req.body,{new:true})
   if(!menu) return res.send('Something went wrong!');
   return res.send(menu) ;
  }
  catch(err){
    res.send('Something went wrong!');
  }

})

router.delete('/delete/:id',(req,res)=> {
  Howtouse.findByIdAndRemove(req.params.id)
  .then((menu)=>res.send(menu))
  .catch(err => res.send("Something went wrong"))

})

module.exports = router;
