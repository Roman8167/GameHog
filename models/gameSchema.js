const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
    imagePath:{
        type:String,
        required:true
    },
    gameName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    mode:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    
    operatingsystems:{
        type:String,
        required:true
    },
    rank:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
    
});
module.exports = mongoose.model("gameItems",productSchema)