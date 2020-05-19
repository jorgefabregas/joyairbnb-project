const express = require('express')
const router = express.Router();

/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>
{
    res.render("general/index");
});


//Route to direct user to about us page
router.get("/about",(req,res)=>
{
    res.render("General/about");
});

router.get("/contact",(req,res)=>
{
    res.render("General/contactUs");
});

//process contact us form (when user submits form)
router.post("/contact-us", (req,res)=>{

    const {firstName,lastName,eMail,message} = req.body;

    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
    to: `Kadeem.Best@humber.ca`,
    from: `${eMail}`,
    subject: 'Contact Us Form Submit',
    html:
    `Visitor's Full name ${firstName} ${lastName} <br>
    Visitor's Email Address ${eMail} <br>
    Visitor's Message ${message} <br>
    `,
    };

//Asynchornous operation (who don't know how long this will take to execute)
    sgMail.send(msg)
    .then(()=>{
        res.redirect("/");
    })
    .catch(err=>{
        console.log(`Error ${err}`);
    });

});


module.exports=router;