const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerReports = new Schema({
    name:{
        type:String,
        required:true
    },
    issue:{
        type:String,
        required:true
    },
    report:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model("customer-report",customerReports)