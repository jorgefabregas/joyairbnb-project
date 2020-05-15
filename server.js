const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');

//creation of app object
const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));

/* parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))*/

//express static middleware
app.use(express.static("public"));

//Handlebars middlware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
})); 
app.set("view engine","handlebars");

//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/keys.env'});

//To allow specific forms and/or links that were submitted to sen PUT and DELETE
app.use((req,res,next)=>{
    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }

    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }

    next();
});

app.use(fileUpload());

app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
  }))

  app.use((req,res,next)=>{

    res.locals.user= req,session.userInfo;
   
    next();
});


  mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error ocurred when connecting to database ${err}`));

//import your router objects
const userRoutes = require("./controllers/User");
const taskRoutes = require("./controllers/Task");
const generalRoutes = require("./controllers/General");
const productRoutes = require("./controllers/Product");

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/task",taskRoutes);
app.use("/product",productRoutes);
app.use("/",(req,res)=>{
    res.render("General/404");
});



const PORT = process.env.PORT;
//Creates an Express Web Server that listens for incomin HTTP Requests
app.listen(PORT,()=>{
    console.log(`Your Web Server has been connected`);
    
});