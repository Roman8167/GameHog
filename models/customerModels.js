const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    telephone:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    game:{
        type:String,
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    totalqty:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:new Date().getMonth()
    }
});
module.exports = mongoose.model("customer-table",customerSchema)