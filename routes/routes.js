const express= require("express");
const router = express.Router();
const mongodb = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/products";
const gameSchema = require("../models/gameSchema");
router.get("/",function(req,res){
    res.render("welcome.ejs")
});



module.exports = router;
