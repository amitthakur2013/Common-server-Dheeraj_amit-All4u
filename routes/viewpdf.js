const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const path = require('path');
const pdfTemplate =require('../documents');
const _=require('lodash')

router.post('/generatePdf/:id', async (req, res,next) => {

    await pdf.create(pdfTemplate(req.body), config = {
		  "height": "313mm",     
		  "width": "210mm",            

  }).toFile(`${__dirname}/pdf/${req.params.id}.pdf`, (err) => {
        if(err) {
            console.log(err);
        }
        res.send("Created!!");
    });
    
});

router.get('/fetch-pdf/:id', (req, res, next) => {
    res.sendFile(`${__dirname}/pdf/${req.params.id}.pdf`)
})

module.exports = router;
