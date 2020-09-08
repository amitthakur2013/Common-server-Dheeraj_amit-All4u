const smtpTransport=require("../config/nodemailerSetup.js");


const sendEmail=async(email,sub,msg)=>{
	let mailDetails = { 
    from: 'sanjeevthakur2013@gmail.com', 
    to: email,
    subject: sub, 
    text: msg
}; 
  
smtpTransport.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log(err); 
    } else { 
        console.log('Email sent successfully'); 
    } 
}); 
}

module.exports=sendEmail;
