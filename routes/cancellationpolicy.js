const router = require("express").Router();

const { Cancellationpolicy } = require("../models/cancellationpolicy");

router.get('/all',(req, res) => {
Cancellationpolicy.find()
.then((menu) => {
  res.send(menu);
})
.catch(err => res.status(400).send('Something went wrong!'))
})

router.post('/new',(req, res) => {
  Cancellationpolicy.create(req.body)
  .then((menu) => {
    res.send(menu);
  })
  .catch(err => res.status(400).send('Something went wrong!'))
})

router.put("/edit/:id",async (req, res) => {
  try{
   const menu=await Cancellationpolicy.findByIdAndUpdate(req.params.id,req.body,{new:true})
   if(!menu) return res.send('Something went wrong!');
   return res.send(menu) ;
  }
  catch(err){
    res.send('Something went wrong!');
  }

})

router.delete('/delete/:id',(req,res)=> {
  Cancellationpolicy.findByIdAndRemove(req.params.id)
  .then((menu)=>res.send(menu))
  .catch(err => res.send("Something went wrong"))

})

module.exports = router;
