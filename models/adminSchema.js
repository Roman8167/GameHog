const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    adminCode:{
        type:Number,
        required:true
    }
});
module.exports = mongoose.model("admin-schema",adminSchema)