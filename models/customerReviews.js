const mongoose = require("mongoose");
const userSchema = mongoose.Schema;
const customerReviews = new userSchema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    customerReview:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    views:{
        type:Number,
        required:true
    },
   likes:{
       type:Number,
       required:true
   },
   dislike:{
       type:Number,
       required:true
   },
   comment:{
       type:Array,
       required:true
   }
    
});
module.exports = mongoose.model("customer-reviews",customerReviews)