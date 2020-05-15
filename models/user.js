const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Indicates the shape of documents entering in the database
const userSchma = new Schema({
    

    firstName:
    {
        type:String,
        required:true
    },

    lastName:
    {
        type:String,
        required:true
    },

    email:
    {
        type:String,
        required:true
    },

    password:
    {
        type:String,
        required:true
    },

    profilePic:
    {
        type:String,
    },

    profilePic:
    {
        type:String
    },
    dateCreated:
    {
        type:Date,
        default:Date.now()
    }
});

userSchma.pre("save", function(next)
{
    // salt generate random characters or strings
    bcrypt.genSalt(10)
    .then((salt)=>{
        bcrypt.hash(this.password,salt)
        .then((encryptPassword)=>{
            this.password = encryptPassword;
            next();
        })
        .catch(err=>console.log(`Error ocurred when hashing ${err}`));
    })
    .catch(err=>console.log(`Error ocurred when salting ${err}`));
})


const userModel = mongoose.model('User', userSchma);

module.exports = userModel;