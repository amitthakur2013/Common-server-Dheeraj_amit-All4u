const router = require("express").Router();

const { MenuTemplate } = require("../models/menuTemplate");

router.get('/all',(req, res) => {
MenuTemplate.find()
.then((menu) => {
  res.send(menu);
})
.catch(err => res.status(400).send('Something went wrong!'))
})

router.post('/new',(req, res) => {
  MenuTemplate.create(req.body)
  .then((menu) => {
    res.send(menu);
  })
  .catch(err => res.status(400).send('Something went wrong!'))
})

router.put("/edit/:id",async (req, res) => {
  try{
   const menu=await MenuTemplate.findByIdAndUpdate(req.params.id,req.body,{new:true})
   if(!menu) return res.send('Something went wrong!');
   return res.send(menu) ;
  }
  catch(err){
    res.send('Something went wrong!');
  }

})

router.delete('/delete/:id',(req,res)=> {
  MenuTemplate.findByIdAndRemove(req.params.id)
  .then((menu)=>res.send(menu))
  .catch(err => res.send("Something went wrong"))

})

module.exports = router;
