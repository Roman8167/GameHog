const express = require("express");
const router = express.Router();
const passport = require("passport")
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/Users"
const bodyParser = require("body-parser");
const urlencoded = bodyParser.urlencoded({extended:false})
const User= require("../models/userSchema")
const bcryptjs = require("bcryptjs");
require('../auth/passport')(passport)
//passport.middleware
router.use(passport.initialize());
router.use(passport.session());
///connect route for mongodb
mongoose.connect(url,function(err,result){
    if(err) throw err;
    console.log("Connected to the user-table")
})
router.get("/login",function(req,res){
    res.render("login.ejs")
});
router.get("/register",function(req,res){
    res.render("register.ejs")
});
//register post route
router.post("/register",urlencoded,function(req,res){
    const errors = [];
    const {name,email,password,password2} = req.body
    if(!name||!email||!password||!password2){
        errors.push({msg:"Please fill all the forms!"})
    }
    if(password!=password2){
        errors.push({msg:"Passwords do not match!"})
    }
    if(password.length<6){
        errors.push({msg:"Password is not strong enough!"})
    }
    if(errors.length>0){
        res.render("register.ejs",{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        const newUser = new User({
            name:name,
            email:email,
            password:password,
            
        });
        const saltRound = 10;
        bcryptjs.genSalt(saltRound,(err,salt)=>{
            if(err) throw err;
            bcryptjs.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then(user=>{
                    req.flash("success_msg","You are now registered and can now log in")
                    res.redirect("/login")
                
                }).catch((err)=>{
                    console.log(err)
                })
            })
        })
    }

})
router.post("/login",urlencoded,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:"/homepage",
        failureRedirect:'/login',
        failureFlash:true,
        
    })(req,res,next)
});
module.exports = router