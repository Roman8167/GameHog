const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/products";
mongoose.connect(url,function(err,db){
    if(err) throw err;
    console.log("Connected to the database")
})
const Schema = mongoose.Schema;
const adminSchemaReply = new Schema({
    name:{
        type:String,
        required:true

    },
    reply:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model("adminReplies",adminSchemaReply);