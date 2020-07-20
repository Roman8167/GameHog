const express = require("express");
const router = express.Router();
const CookieParser = require("cookie-parser");
const mongodb = require("mongodb")
const mongoose = require("mongoose");
const session = require("express-session");
const gameSchema = require("../models/gameSchema");
const MongoStore = require("connect-mongo")(session)
const morgan = require("morgan");
const url = "mongodb://localhost:27017/products";
const customerSchema = require("../models/customerModels");
const adminReplies = require("../models/adminCustomerReply")
const userSchema = require("../models/userSchema");
const customerReviews = require("../models/customerReviews");
const customerReports = require("../models/customerReport")
const ObjectID = require("mongodb").ObjectID;
router.use(CookieParser())
router.use((req,res,next)=>{
    res.locals.session = req.session.cart;
    next()
})
router.use(session({
    secret:"mytopsecret",
    saveUninitialized:true,
    resave:true,
    cookie:{maxAge:180*60*1000},
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))
mongoose.connect(url,function(err,db){
    if(err) throw err;
    console.log("Connected to the product collection")
})
router.use(morgan("dev"))
const bodyParser = require("body-parser");
const urlencoded = bodyParser.urlencoded({extended:false});
const{checkAuthenticated} = require("../auth/auth");
router.get("/homepage",checkAuthenticated,function(req,res){
    gameSchema.find({},function(err,game){
        if(err) throw err;
        res.render('homepage.ejs',{games:game,tags:'',results:'',user:req.user.name,newPrice:''})
    })
});
var cart = new Set();
router.get("/add-to-cart/:id",function(req,res){
    var gameIds = req.params.id;
    gameSchema.findById(gameIds,function(err,games){
        if(err) throw err;
        var gameItems = cart[games];
        if(!gameItems){
            gameItems = cart[games] = {_id:games._id,gameName:games.gameName,price:0,qty:0,totalPrice:0,totalQty:0}
        }
        cart.add(cart[games]);
        var removeDuplicates = [...cart]
        cart[games].qty++
        cart[games].price = games.price * cart[games].qty;
        cart[games].totalQty++
        var totalPrice = 0;
        var totalQuantity = 0;
        for(var i=0;i<removeDuplicates.length;i++){
            totalPrice+=removeDuplicates[i].price
        }
        for(var i=0;i<removeDuplicates.length;i++){
            totalQuantity+=removeDuplicates[i].qty
        }
        res.render("cart.ejs",{games:removeDuplicates,totalPrice:Math.abs(totalPrice),totalQty:Math.abs(totalQuantity)})
    })
})
router.get("/removeAll",function(req,res){
    cart = new Set();
    removeDuplicates = [...cart];
    res.render("cart.ejs",{games:removeDuplicates,totalPrice:0,totalQty:0})
})
router.get("/increase/:id",function(req,res){
    var gameIds = req.params.id;
    gameSchema.findById(gameIds,function(err,games){
        if(err) throw err;
        var gameItems = cart[games];
        if(!gameItems){
            gameItems = {_id:games._id,gameName:games.gameName,price:0,qty:0,totalPrice:0,totalQty:0}
        }
        var totalPrice = 0;
        var totalQty = 0;
        var removeDuplicates = [...cart];
        cart[games].qty++
        cart[games].price = games.price * cart[games].qty;
        cart[games].totalQty++
        for(var i=0;i<removeDuplicates.length;i++){
            totalPrice+=removeDuplicates[i].price
        }
        for(var i=0;i<removeDuplicates.length;i++){
            totalQty+=removeDuplicates[i].qty
        }
        res.render("cart.ejs",{games:removeDuplicates,totalPrice:Math.abs(totalPrice),totalQty:Math.abs(totalQty)})
    })
});
router.get("/decrease/:id",function(req,res){
    var gameIds = req.params.id;
    gameSchema.findById(gameIds,function(err,games){
        if(err) throw err;
        var gameItems = cart[games];
        if(!gameItems){
            gameItems = cart[games] = {_id:games._id,gameName:games.gameName,price:0,qty:0,totalPrice:0,totalQty:0}
        }
        var removeDuplicates = [...cart]
        cart[games].qty--;
        cart[games].price = games.price * cart[games].qty;
        var totalPrice = 0;
        var totalQty = 0;
        cart[games].totalPrice-=1;
        cart.forEach((item,index,value)=>{
            totalPrice-=item.price
        })
        cart.forEach(function(item,index,value){
            totalQty-=item.qty
        })
        cart.forEach((items,index,values)=>{
            if(cart[games].qty<=0||items.qty<=0||items.totalPrice<=0){
                cart.delete(cart[games])
            }
        })
        
        res.render("cart.ejs",{games:removeDuplicates,totalPrice:Math.abs(totalPrice),totalQty:Math.abs(totalQty)})
    })
    
})
router.post("/homepage",urlencoded,function(req,res){
    const{searchgame} = req.body;
    gameSchema.find(
        {
            gameName:
            {
                $regex:searchgame}
            },function(err,queryResults){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryResults,user:req.user.name})
    })
})
router.get("/adventure",function(req,res){
    gameSchema.find(
        {
            category:
            {
                $eq:"Action-adventure game"
            }
            },function(err,queryresult){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryresult,user:req.user.name})
    })
});
router.get("/tactical",function(req,res){
    gameSchema.find(
        {
            category:
            {
                $eq:"Tactical shooter"
            }
            },function(err,queryresult){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryresult,user:req.user.name})
    })
});
router.get("/sports",function(req,res){
    gameSchema.find(
        {
            category:
            {
                $eq:"Sports Game"
            }
            },function(err,queryresult){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryresult,user:req.user.name})
    })
})
router.post("/genre",urlencoded,function(req,res){
    const{category} = req.body
    gameSchema.find({
        category:{
            $regex:category
        }
    },function(err,queryResults){
        if(err) throw err;
        if(!queryResults){
            req.flash("error_msg","Query does not match!")
        }
        else{
            res.render("homepage.ejs",{games:queryResults,user:req.user.name})
        }
    })
});
router.post("/range",urlencoded,function(req,res){
    const{minRange,maxRange} = req.body
    if(!minRange||!maxRange){
        req.flash("error_msg","Fill the query!")
    }
    else{
        gameSchema.find({price:{$gte:minRange,$lte:maxRange}},function(err,queryResults){
            if(err) throw err;
            if(!queryResults){
                req.flash("error_msg","No results Found!");
                
            }
            else{
                req.flash("success_msg","Success!")
                res.render("homepage.ejs",{games:queryResults,user:req.user.name})
            }
        })
    }
})
router.get("/windows",function(req,res){
    gameSchema.find({operatingsystems:{$in:["Microsoft Windows"]}},function(err,queryResults){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryResults,user:req.user.name})
    })
})
router.post("/platforms",urlencoded,function(req,res){
    const{platforms} = req.body
    gameSchema.find({operatingsystems:{$regex:platforms}},function(err,queryResults){
        if(err) throw err;
        res.render("homepage.ejs",{games:queryResults,user:req.user.name})
    })
})
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success_msg","You are currently now logged out!")
    res.redirect("/")
});
router.get("/checkout",checkAuthenticated,function(req,res){
    var gameItems = '';
    var subtotal = 0;
    var totalQty = 0
    cart.forEach(function(items,index,array){
        subtotal += items.price
    })
    cart.forEach(function(items,index,array){
        totalQty+=items.qty
    });
    cart.forEach((item,index,array)=>{
        gameItems+=item.gameName
    })
    userSchema.find({},function(err,users){
        if(err) throw err;
        res.render("checkout.ejs",{gameName:gameItems,subtotal:subtotal,totalQty:totalQty,name:req.user.name,email:req.user.email})
    })
        

    
});
router.post("/checkout",urlencoded,function(req,res){
    const{name,email,address,telephone,city,game,subtotal,totalqty} = req.body
    if(!name||!email||!address||!telephone||!city||!subtotal||!totalqty){
        req.flash("error_msg","Please fill the forms!");
        res.redirect("/checkout")
    }
    if(!subtotal||!totalqty){
        req.flash("error_msg","No product has been purchased!");
        res.redirect("/checkout")
    }
    else{
        const newCustomers = new customerSchema({
            name:name,
            email:email,
            address:address,
            telephone:telephone,
            city:city,
            game:game,
            subtotal:subtotal,
            totalqty:totalqty,
            date:new Date
            
        });
        newCustomers.save().then(req.flash("success_msg","The Purchase was Successful"),res.redirect("/homepage")).catch((err)=>{
            console.log(err)
        })
    }
});
router.get("/reviews",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerReview){
        if(err) throw err;
        for(var i=0;i<customerReview.length;i++){
        res.render("review.ejs",{user:req.user.name,customerReview:customerReview,views:customerReview[i].views})
            
            
        }
    
    })
})
router.post("/reviews",urlencoded,function(req,res){
    if(!req.body.rate||!req.body.customerReview){
        req.flash("error_msg","Please fill the forms!");
        res.redirect("/reviews")
    }
    else{
    var newcustomerReviews = new customerReviews({
        name:req.user.name,
        type:req.body.type,
        rate:req.body.rate,
        customerReview:req.body.customerReview,
        likes:0,
        dislike:0,
        views:0,
        comment:[]
    });
    newcustomerReviews.save().then(req.flash("success_msg","Posted Successfully!"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
}
});
router.get("/deleteReview/:id",function(req,res){
    var gameId = req.params.id;
    customerReviews.findByIdAndDelete(gameId).then(req.flash("success_msg","Deleted Successfully!"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
});
router.post("/updateReview",urlencoded,function(req,res){
    var orignalName = {name:req.user.name};
    var update = {type:req.body.type,rate:req.body.rate,customerReview:req.body.customerReview};
    customerReviews.update(orignalName,{$set:update}).then(req.flash("success_msg","Updated Successfully"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
});
router.get("/likebutton",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerReviews){
        if(err) throw err;
        for(var i=0;i<customerReviews.length;i++){
            customerReviews[i].likes+=1;
            customerReviews[i].save().catch((err)=>{
                console.log(err)
            })
            res.render("review.ejs",{user:customerReviews[i].name,customerReview:customerReviews,likes:customerReviews[i].likes,views:customerReviews[i].views})
        }
    })
});
router.get("/dislikeButton",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerReview){
        if(err) throw err;
        for(var i=0;i<customerReview.length;i++){
        customerReview[i].dislike+=1;
        customerReview[i].save().then(res.render("review.ejs",{user:customerReview[i].name,customerReview:customerReview,likes:customerReview[i].likes,views:customerReview[i].views,dislikes:customerReview[i].dislike})).catch((err)=>{
            console.log(err)
        })
        
        }
    })
});
router.post("/comment",urlencoded,function(req,res){
    var {comment} = req.body;
    if(!comment){
        req.flash("error_msg","Please fill the comment box!");
        res.redirect("/reviews")
    }
    else{
        
            customerReviews.update({$push:{comment:{_id:ObjectID(),name:req.user.name,comment:req.body.comment,likes:0,dislike:0,reply:[]}}}).then(req.flash("success_msg","Comment Added!"),res.redirect("/reviews")).catch((err)=>{
                console.log(err)
            })
        
    }
});
router.post("/editComment/:id",urlencoded,function(req,res){
    customerReviews.update({"comment._id":ObjectID(req.params.id)},{$set:{"comment.$.comment":req.body.comment}}).then(req.flash("success_msg","Comment Edited!"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
})
router.get("/deleteComment/:id",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerDetails){
        if(err) throw err;
        for(var i=0;i<customerDetails.length;i++){
            for(var j=0;j<customerDetails[i].comment.length;j++){
                if(req.user.name!=customerDetails[i].comment[j].name){
                    req.flash("error_msg","Error!, You cannot delete other's post!");
                    res.redirect("/reviews")
                }
                else{
                    customerReviews.update({$pull:{comment:{_id:ObjectID(req.params.id)}}}).then(req.flash("success_msg","Comment Deleted!"),res.redirect("/reviews")).catch((err)=>{
                        console.log(err)
                    })
                }
            }
        }
    })
});
router.post("/editComment",urlencoded,function(req,res){
    customerReviews.update({"comment.comment":req.body.initialcomment},{$set:{"comment.$.comment":req.body.comment}}).then(req.flash("success_msg","Comment Edited"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)

    })
});
router.get("/likeComment/:id",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerResults){
        if(err) throw err;
        for(var i=0;i<customerResults.length;i++){
            for(var j=0;j<customerResults[i].comment.length;j++){
                if(customerResults[i].comment[j]._id==req.params.id){
                    var likes = customerResults[i].comment[j].likes+=1;
                    customerReviews.update({"comment._id":ObjectID(req.params.id)},{$set:{"comment.$.likes":likes}}).then(req.flash("success_msg","Comment Liked!"),res.redirect('/reviews')).catch((err)=>{
                        console.log(err)
                    })
                }
                
            }
        }
    })
})
router.get("/dislikeComment/:id",urlencoded,function(req,res){
    customerReviews.find({}).exec(function(err,customerReview){
        if(err) throw err;
        for(var i=0;i<customerReview.length;i++){
            for(var j=0;j<customerReview[i].comment.length;j++){
                if(customerReview[i].comment[j]._id==req.params.id){
                    var dislikes = customerReview[i].comment[j].dislikes+=1;
                    customerReviews.update({"comment._id":ObjectID(req.params.id)},{$set:{"comment.$.dislikes":dislikes}}).then(req.flash("success_msg","Comment Disliked"),res.redirect("/reviews")).catch((err)=>{
                        console.log(err)
                    })
                }
            }
        }
    })
});
router.post("/reply",urlencoded,function(req,res){
    customerReviews.update({"comment._id":ObjectID(req.body.replyID)},{$push:{"comment.$.reply":{_id:ObjectID(),name:req.user.name,reply:req.body.reply}}}).then(req.flash("success_msg","Comment Replied"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
});
router.get("/deleteReply/:id",function(req,res){
    customerReviews.update({},{$pull:{"comment.$[].reply":{_id:ObjectID(req.params.id)}}}).then(req.flash("success_msg","Comment Deleted"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
})
router.post("/editReply",urlencoded,function(req,res){
    customerReviews.update({"comment.reply.reply":req.body.initialReplies},{$set:{"comment.$[].reply.$.reply":req.body.reply}}).then(req.flash("success_msg","Comment Edited"),res.redirect("/reviews")).catch((err)=>{
        console.log(err)
    })
})

router.get("/details",checkAuthenticated,urlencoded,function(req,res){
customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:"$name",totalQty:{$sum:"$totalqty"}}}]).exec(function(err,results){
    if(err) throw err;
    for(var j=0;j<results.length;j++){
        var totalQty = results[j].totalQty
        customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:"$name",totalPurchased:{$sum:"$subtotal"}}}]).exec(function(err,totalBought){
            if(err) throw err;
            for(var i = 0;i<totalBought.length;i++){
                var totalBoughts = totalBought[i].totalPurchased
                customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:'$name',mostPurchasedGames:{$max:"$game"}}}]).exec(function(err,mostBoughtGames){
                    if(err) throw err;
                    for(var i=0;i<mostBoughtGames.length;i++){
                        var mostBoughtGame = mostBoughtGames[i].mostPurchasedGames;
                        customerReviews.count({"comment.name":req.user.name}).exec(function(err,results){
                            if(err) throw err;
                            var commentCount = results;
                            customerReviews.count({"comment.reply.name":req.user.name}).exec(function(err,results2){
                                if(err) throw err;
                                var replyCommentCount = results2;
                                var totalComments = commentCount + replyCommentCount;
                                customerSchema.find({name:req.user.name}).exec(function(err,results){
                                    if(err) throw err;
                                    for(var i=0;i<results.length;i++){
                                        console.log(results[i])
                                    res.render("details.ejs",{order:totalQty,totalBought:totalBoughts,mostBoughtGame:mostBoughtGame,totalComments:totalComments,comment:'',replies:'',user:req.user.name,date:results});
                                    }
                                })
                            
                            })

                        })
                    }
                })
            }
        })
    }
})                                                                                  
});
router.get("/showComments",urlencoded,function(req,res){
customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:"$name",totalQty:{$sum:"$totalqty"}}}]).exec(function(err,results){
    if(err) throw err;
    for(var j=0;j<results.length;j++){
        var totalQty = results[j].totalQty
        customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:"$name",totalPurchased:{$sum:"$subtotal"}}}]).exec(function(err,totalBought){
            if(err) throw err;
            for(var i = 0;i<totalBought.length;i++){
                var totalBoughts = totalBought[i].totalPurchased
                customerSchema.aggregate([{$match:{name:{$in:[req.user.name]}}},{$group:{_id:'$name',mostPurchasedGames:{$max:"$game"}}}]).exec(function(err,mostBoughtGames){
                    if(err) throw err;
                    for(var i=0;i<mostBoughtGames.length;i++){
                        var mostBoughtGame = mostBoughtGames[i].mostPurchasedGames;
                        customerReviews.count({"comment.name":req.user.name}).exec(function(err,results){
                            if(err) throw err;
                            var commentCount = results;
                            customerReviews.count({"comment.reply.name":req.user.name}).exec(function(err,results2){
                                if(err) throw err;
                                var replyCommentCount = results2;
                                var totalComments = commentCount + replyCommentCount;
                                customerReviews.find({"comment.name":req.user.name}).exec(function(err,showComments){
                                    if(err) throw err;
                                    
                                    customerReviews.find({"comment.reply.name":req.user.name}).exec(function(err,showReplies){
                                        if(err) throw err;
                                        customerReviews.find({}).exec(function(err,results){
                                            if(err) throw err;
                                            res.render("details.ejs",{order:totalQty,totalBought:totalBoughts,mostBoughtGame:mostBoughtGame,totalComments:totalComments,comment:showReplies,replies:showComments,user:req.user.name,date:results})
                                        })
                                        
                                    })
                                })
                            })
                        })
                    }
                })
            }
        })
    }
})
});
router.get("/report",checkAuthenticated,function(req,res){
adminReplies.find({name:req.user.name}).exec(function(err,results){
    if(err) throw err;
    res.render("report.ejs",{user:req.user.name,adminMessage:results})
})
});
router.post("/report",urlencoded,function(req,res){
const{issue,report} = req.body;
if(!report){
    res.redirect("/reviews");
    req.flash("error_msg","Please fill the forms!")
}
else{
    customerReports.insertMany({name:req.user.name,issue:issue,report:report}).then(req.flash("success_msg","Report Submitted"),res.redirect("/report")).catch((err)=>{
        console.log(err)
    })
}

});

module.exports = router;