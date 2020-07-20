const express = require("express");
const router = express.Router();
const customerModels = require("../models/customerModels");
const userSchema = require("../models/userSchema")
const mongodb = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID
const bodyParser = require("body-parser");
const url = "mongodb://localhost:27017/products";
const gameSchema = require("../models/gameSchema");
const flash = require("connect-flash")
const urlencoded = bodyParser.urlencoded({extended:false});
const customerReports = require("../models/customerReport");
const adminSchema = require("../models/adminSchema");
const adminReplies = require("../models/adminCustomerReply")
const chartjs = require("chart.js");
router.use(bodyParser.json())
router.use(flash())
router.get("/adminAuth",function(req,res){
    res.render("adminAuth.ejs")
});
router.post("/adminAuth",urlencoded,function(req,res){
    const{username,adminCode} = req.body;
    mongodb.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("admins");
        dbo.collection("administrator").find({}).toArray(function(err,result){
            if(err) throw err;
            result.forEach(function(game){
                if(game.username==username && game.adminCode==adminCode){
                    res.redirect("/admin");
                    req.flash("success_msg","You are currently now logged in as an Admin!")
                }
                else{
                    req.flash("error_msg","Password and Username does not match!");
                    res.redirect("/adminAuth")
                }   
            })
        })
    })
});
router.get("/admin",function(req,res){
    customerModels.aggregate([{$match:{}},{$group:{_id:"$name",totalSold:{$sum:"$totalqty"}}}]).exec(function(err,chartResults){
        if(err) throw err;
       
    
    customerModels.find({},function(err,customerTables){
       
        if(err) throw err;

    
   
    customerModels.aggregate(
        [
            {
                $count:"name"}
            ]
            ).exec(function(err,result){
        if(err) throw err;
        customerModels.aggregate(
            [
                {
                    $group:{
                        _id:"",totalQty:{$sum:"$totalqty"}
                    }
                }
            ]
            ).exec(function(err,qtyresult){
            if(err) throw err;
            for(var i=0;i<result.length;i++){

            
            for(var i=0;i<qtyresult.length;i++){
                customerModels.aggregate(
                    [
                        {
                            $group:{_id:'',totalRevenue:{$sum:"$subtotal"}
                        }
                    }
                ]
                ).exec(function(err,revenueResults){
                    if(err) throw err;
                    for(var i=0;i<revenueResults.length;i++){
                      gameSchema.aggregate([{$count:"gameName"}]).exec(function(err,countQueries){
                          if(err) throw err;
                        for(var i=0;i<countQueries.length;i++){
                            res.render("admin.ejs",{totalUsers:result[i].name,totalQty:qtyresult[i].totalQty,totalRevenue:revenueResults[i].totalRevenue,shopItems:countQueries[i].gameName,gameItems:customerTables,chartResults:chartResults})
                            

                        }
                        
                      })
                      
                    }
                })
            }
           
        }
        })
    });
    
    })
})
})
router.post("/admin",urlencoded,function(req,res){
    const errors = [];
    const{imagePath,gameName,description,price,mode,operatingsystems,category,rank,company,date} = req.body;
    if(!imagePath||!gameName||!description||!price||!mode||!operatingsystems||!category||!rank||!company||!date){
        errors.push({msg:"Please fill all the forms!"})
    }
    if(errors.length>0){
        res.render("admin.ejs",{
            errors,
            imagePath,
            gameName,
            description,
            price,
            mode,
            operatingsystems,
            category,
            rank,
            company,
            date
        });
    }
    else{
        const newGames = new gameSchema({
            imagePath:imagePath,
            gameName:gameName,
            description:description,
            price:price,
            mode:mode,
            operatingsystems:operatingsystems,
            category:category,
            rank:rank,
            company:company,
            date:date
        });
        newGames.save().then(res.redirect("/admin"),req.flash("success_msg","Posted Successfully")).catch((err)=>{
            console.log(err)
        })
    }
    
});
router.post("/searchname",urlencoded,function(req,res){
    const{searchname} = req.body
    customerModels.find({name:{$regex:searchname}},function(err,queryGames){
        if(err) throw err;
        
    
    customerModels.aggregate(
        [
            {
                $count:"name"}
            ]
            ).exec(function(err,result){
        if(err) throw err;
        customerModels.aggregate(
            [
                {
                    $group:{
                        _id:"",totalQty:{$sum:"$totalqty"}
                    }
                }
            ]
            ).exec(function(err,qtyresult){
            if(err) throw err;
            for(var i=0;i<result.length;i++){

            
            for(var i=0;i<qtyresult.length;i++){
                customerModels.aggregate(
                    [
                        {
                            $group:{_id:'',totalRevenue:{$sum:"$subtotal"}
                        }
                    }
                ]
                ).exec(function(err,revenueResults){
                    if(err) throw err;
                    for(var i=0;i<revenueResults.length;i++){
                      gameSchema.aggregate([{$count:"gameName"}]).exec(function(err,countQueries){
                          if(err) throw err;
                        for(var i=0;i<countQueries.length;i++){
                            res.render("admin.ejs",{totalUsers:result[i].name,totalQty:qtyresult[i].totalQty,totalRevenue:revenueResults[i].totalRevenue,shopItems:countQueries[i].gameName,gameItems:queryGames})
                           
                        }
                        
                      })
                      
                    }
                })
            }
           
        }
        })
    });
})
})
router.get("/mandalay",function(req,res){
    customerModels.find({city:{$eq:'Mandalay'}},function(err,queryGames){
        if(err) throw err;
        
    
    customerModels.aggregate(
        [
            {
                $count:"name"}
            ]
            ).exec(function(err,result){
        if(err) throw err;
        customerModels.aggregate(
            [
                {
                    $group:{
                        _id:"",totalQty:{$sum:"$totalqty"}
                    }
                }
            ]
            ).exec(function(err,qtyresult){
            if(err) throw err;
            for(var i=0;i<result.length;i++){

            
            for(var i=0;i<qtyresult.length;i++){
                customerModels.aggregate(
                    [
                        {
                            $group:{_id:'',totalRevenue:{$sum:"$subtotal"}
                        }
                    }
                ]
                ).exec(function(err,revenueResults){
                    if(err) throw err;
                    for(var i=0;i<revenueResults.length;i++){
                      gameSchema.aggregate([{$count:"gameName"}]).exec(function(err,countQueries){
                          if(err) throw err;
                        for(var i=0;i<countQueries.length;i++){
                            res.render("admin.ejs",{totalUsers:result[i].name,totalQty:qtyresult[i].totalQty,totalRevenue:revenueResults[i].totalRevenue,shopItems:countQueries[i].gameName,gameItems:queryGames})
                           
                        }
                        
                      })
                      
                    }
                })
            }
           
        }
        })
    });
})
});
router.get("/mandalay",function(req,res){
    customerModels.find({city:{$eq:'Yangon'}},function(err,queryGames){
        if(err) throw err;
        
    
    customerModels.aggregate(
        [
            {
                $count:"name"}
            ]
            ).exec(function(err,result){
        if(err) throw err;
        customerModels.aggregate(
            [
                {
                    $group:{
                        _id:"",totalQty:{$sum:"$totalqty"}
                    }
                }
            ]
            ).exec(function(err,qtyresult){
            if(err) throw err;
            for(var i=0;i<result.length;i++){

            
            for(var i=0;i<qtyresult.length;i++){
                customerModels.aggregate(
                    [
                        {
                            $group:{_id:'',totalRevenue:{$sum:"$subtotal"}
                        }
                    }
                ]
                ).exec(function(err,revenueResults){
                    if(err) throw err;
                    for(var i=0;i<revenueResults.length;i++){
                      gameSchema.aggregate([{$count:"gameName"}]).exec(function(err,countQueries){
                          if(err) throw err;
                        for(var i=0;i<countQueries.length;i++){
                            res.render("admin.ejs",{totalUsers:result[i].name,totalQty:qtyresult[i].totalQty,totalRevenue:revenueResults[i].totalRevenue,shopItems:countQueries[i].gameName,gameItems:queryGames})
                           
                        }
                        
                      })
                      
                    }
                })
            }
           
        }
        })
    });
})
});
router.post("/searchcity",urlencoded,function(req,res){
    const{searchcity} = req.body;
    customerModels.find({city:{$regex:searchcity}},function(err,queryGames){
        if(err) throw err;
        customerModels.aggregate(
            [
                {
                    $count:"name"}
                ]
                ).exec(function(err,result){
            if(err) throw err;
            customerModels.aggregate(
                [
                    {
                        $group:{
                            _id:"",totalQty:{$sum:"$totalqty"}
                        }
                    }
                ]
                ).exec(function(err,qtyresult){
                if(err) throw err;
                for(var i=0;i<result.length;i++){
    
                
                for(var i=0;i<qtyresult.length;i++){
                    customerModels.aggregate(
                        [
                            {
                                $group:{_id:'',totalRevenue:{$sum:"$subtotal"}
                            }
                        }
                    ]
                    ).exec(function(err,revenueResults){
                        if(err) throw err;
                        for(var i=0;i<revenueResults.length;i++){
                          gameSchema.aggregate([{$count:"gameName"}]).exec(function(err,countQueries){
                              if(err) throw err;
                            for(var i=0;i<countQueries.length;i++){
                                res.render("admin.ejs",{totalUsers:result[i].name,totalQty:qtyresult[i].totalQty,totalRevenue:revenueResults[i].totalRevenue,shopItems:countQueries[i].gameName,gameItems:queryGames})
                               
                            }
                            
                          })
                          
                        }
                    })
                }
               
            }
            })
        });
    })
    
});
router.get("/deleteRole/:id",function(req,res){
    var gameId = req.params.id;
    customerModels.findByIdAndDelete(gameId,function(err,result){
        if(err) throw err;
        
    }).then(res.redirect("/admin")).catch((err)=>{
        console.log(err)
    })
});
router.get("/manage",function(req,res){
    res.render("manage.ejs",{expense:'',totalExpense:'',totalQty:''})
});
router.post("/expenditure",urlencoded,function(req,res){
        customerModels.aggregate([{$match:{}},{$group:{_id:"$name",totalqty:{$sum:"$totalqty"},expense:{$sum:"$subtotal"}}}],function(err,expense){
            if(err) throw err;
            customerModels.aggregate([{$group:{_id:"",totalExpense:{$sum:"$subtotal"},totalQty:{$sum:"$totalqty"}}}]).exec(function(err,results){
                if(err) throw err;
                for(var i=0;i<results.length;i++){
                    res.render("manage.ejs",{expense:expense,totalExpense:results[i].totalExpense,totalQty:results[i].totalQty})
                }
            })
            
        })
})
router.post("/discount",urlencoded,function(req,res){
    const{price,discount,elseDiscount} = req.body;
    gameSchema.find({},function(err,results){
        if(err) throw err;
        gameSchema.aggregate(
            [
                {
                    $project:{
                        price:
                        {
                            $cond:
                            {
                                if:{
                                    $gt:
                                    [
                                        "$price",parseFloat(price)]
                                    }
                                    ,then
                                    :
                                    {
                                        $multiply:
                                        [
                                            "$price",parseFloat(discount)/100]
                                        }
                                        ,else:{$multiply:["$price",1]}
                                    }
                                }
                            }
                        }
                    ],function(err,queryResults){
            if(err) throw err;
            
            
            for(var i=0;i<queryResults.length;i++){
            for(var i=0;i<queryResults.length;i++){
            gameSchema.find({_id:queryResults[i]._id}).update({$set:{price:queryResults[i].price}},function(err,results){
                if(err) throw err;
                res.redirect("/manage");
                req.flash("success_msg","Discount has been added!")
            }).catch((err)=>{
                console.log(err)
            })
            
        } 
    }
        })
    })
});
router.post("/increasePrice",urlencoded,function(req,res){
    var {addPrice,percentageIncrease} = req.body;
    if(!addPrice||!percentageIncrease){
        req.flash('error_msg',"Please fill the form!");
        res.redirect("/manage")
    }
    else{
        var addPercentage = 100 + parseFloat(percentageIncrease)
        gameSchema.aggregate([{$project:{price:{$cond:{if:{$lt:["$price",parseFloat(addPrice)]},then:{$multiply:["$price",addPercentage/100]},else:{$multiply:["$price",1]}}}}}]).exec(function(err,queryResults){
            if(err) throw err;
            for(var i=0;i<queryResults.length;i++){
                gameSchema.updateOne({_id:queryResults[i]._id},{$set:{price:queryResults[i].price}},function(err,updatedResults){
                    if(err) throw err;
                    res.redirect('/manage');
                    req.flash("success_msg","Price increased!")
                    console.log(queryResults)
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
    }
    
})
router.get("/alphabet",function(req,res){
    customerModels.aggregate([{$match:{}},{$group:{_id:"$name",totalqty:{$sum:"$totalqty"},expense:{$sum:"$subtotal"}}},{$sort:{_id:1}}]).exec(function(err,result){
        if(err) throw err;
        customerModels.aggregate([{$group:{_id:"",totalExpense:{$sum:"$subtotal"},totalQty:{$sum:"$totalqty"}}}]).exec(function(err,queryResults){
            if(err) throw err;
            for(var i=0;i<queryResults.length;i++){
                res.render("manage.ejs",{expense:result,totalExpense:queryResults[i].totalExpense,totalQty:queryResults[i].totalQty})
            }
        })
    })
})
router.get("/sortAscend",function(req,res){
    customerModels.aggregate([{$match:{}},{$group:{_id:"$name",totalqty:{$sum:"$totalqty"},expense:{$sum:"$subtotal"}}},{$sort:{expense:1}}]).exec(function(err,queryResults){
        if(err) throw err;
        customerModels.aggregate([{$group:{_id:"",totalExpense:{$sum:"$subtotal"},totalQty:{$sum:"$totalqty"}}}]).exec(function(err,results){
            if(err) throw err;
            for(var i=0;i<results.length;i++){
                res.render("manage.ejs",{expense:queryResults,totalExpense:results[i].totalExpense,totalQty:results[i].totalQty})
            }
        })
    })
});
router.get("/sortDescend",function(req,res){
    customerModels.aggregate([{$match:{}},{$group:{_id:"$name",totalqty:{$sum:"$totalqty"},expense:{$sum:"$subtotal"}}},{$sort:{expense:-1}}]).exec(function(err,games){
        if(err) throw err;
        customerModels.aggregate([{$group:{_id:"",totalExpense:{$sum:"$subtotal"},totalQty:{$sum:"$totalqty"}}}]).exec(function(err,queryResults){
            if(err) throw err;
            for(var i=0;i<queryResults.length;i++){
                res.render("manage.ejs",{expense:games,totalExpense:queryResults[i].totalExpense,totalQty:queryResults[i].totalQty})
            }
        })
    })
});
router.get("/finance",function(req,res){
    var revenue = 0
    customerModels.aggregate([{$group:{_id:'',revenue:{$sum:"$subtotal"}}}]).exec(function(err,queryResults){
        if(err) throw err;
        for(var i=0;i<queryResults.length;i++){
            res.render("finance.ejs",{expenses:'',Incomes:'',revenue:queryResults[i].revenue,totalExpense:'',totalIncomes:'',profit:profit,status:''})
        }
    })
    
});
var totalExpenses = 0;
var totalIncomes = 0;
var profit = 0;
router.post("/expenses",urlencoded,function(req,res){
   var{legal,wage,marketing,insurance,contractors,computer} = req.body
    legal = parseFloat(legal),
    wage = parseFloat(wage),
    marketing = parseFloat(marketing);
    insurance = parseFloat(insurance),
    contractors = parseFloat(contractors),
    computer = parseFloat(computer)
    totalExpenses = legal + wage + marketing + insurance + contractors + computer;
    customerModels.aggregate([{$group:{_id:"",revenue:{$sum:"$subtotal"}}}]).exec(function(err,queryResults){
        if(err) throw err;
    for(var i=0;i<queryResults.length;i++){
    res.render("finance.ejs",{expenses:totalExpenses,revenue:queryResults[i].revenue,Incomes:'',totalExpense:totalExpenses,totalIncomes:totalIncomes,profit:profit,status:''})
    }
})
});
router.post("/income",urlencoded,function(req,res){
    var{revenue,investment,subsidies,grossprofit} = req.body;
    investment = parseFloat(investment);
    subsidies = parseFloat(subsidies);
    grossprofit = parseFloat(grossprofit);
    
    customerModels.aggregate([{$group:{_id:'',revenue:{$sum:"$subtotal"}}}]).exec(function(err,results){
        if(err) throw err;
    for(var i=0;i<results.length;i++){
    totalIncomes = results[i].revenue + investment + subsidies + grossprofit;
    console.log(totalIncomes)
    profit = totalIncomes - totalExpenses
    if(profit<=0){
        res.render("finance.ejs",{Incomes:totalIncomes,expenses:'',revenue:revenue[i].revenue,totalExpense:totalExpenses,totalIncomes:totalIncomes,profit:profit,status:'Your debt is'})
    }
    else{
        res.render("finance.ejs",{Incomes:totalIncomes,expenses:'',revenue:revenue[i].revenue,totalExpense:totalExpenses,totalIncomes:totalIncomes,profit:profit,status:'Your profit is'})
    }
    }
})
});
router.get("/chart",function(req,res){
    customerModels.aggregate([{$match:{}},{$group:{_id:"$_id",totalSold:{$sum:"$totalqty"}}}]).exec(function(err,chartResults){
        if(err) throw err;
        customerModels.aggregate([{$match:{}},{$group:{_id:'',totalOrders:{$sum:"$totalqty"}}}]).exec(function(err,totalOrders){
            if(err) throw err;
            
        
        customerModels.aggregate([{$match:{}},{$group:{_id:'$_id',revenue:{$sum:"$subtotal"}}}]).exec(function(err,revenueResults){
        customerModels.aggregate([{$match:{}},{$group:{_id:"",totalRevenue:{$sum:"$subtotal"}}}]).exec(function(err,totalRevenue){
            if(err) throw err
        
        
            ///finding the most purchased game with the totalqty
            customerModels.aggregate([{$match:{}},{$group:{_id:"",mostSoldGames:{$max:"$game"}}}]).exec(function(err,queryResults){
                if(err) throw err;
                queryResults.forEach(function(item){
                    customerModels.aggregate([{$match:{game:{$in:[item.mostSoldGames]}}},{$group:{_id:"",total:{$sum:"$totalqty"}}}]).exec(function(err,mostsoldQuantity){
                    if(err) throw err;
                        userSchema.find({}).exec(function(err,fullUserDetails){
                            if(err) throw err;
                            userSchema.aggregate([{$count:'name'}]).exec(function(err,userChart){
                                if(err) throw err;
                                res.render("chart.ejs",{purchaseRates:chartResults,revenueResults:revenueResults,mostSoldGames:queryResults,mostSoldQuantity:mostsoldQuantity,totalRevenue:totalRevenue,totalOrders:totalOrders,fullUserDetails:fullUserDetails,userChart:userChart})
                            })
                        })
                    })
                })
                
            })   
            
        })
    })
    })  
    })
});
router.get("/checkReports",function(req,res){
customerReports.find({}).exec(function(err,customerReports){


    var url2 = "mongodb://localhost:27017/admins";
    mongodb.connect(url2,function(err,db){
        if(err) throw err;
        var dbo = db.db("admins");
        dbo.collection("administrator").find({}).toArray(function(err,results){
            if(err) throw err;
            for(var i=0;i<results.length;i++){
               
                    res.render("checkReport.ejs",{user:results[i].username,customerReports:customerReports})
                
                
            }
        })
    })
}) 
})
router.get("/deleteReport/:id",function(req,res){
    var customerReportsId = req.params.id;
    customerReports.findByIdAndDelete(ObjectId(customerReportsId)).then(req.flash("success_msg","Report Deleted"),res.redirect("/checkReports")).catch((err)=>{
        console.log(err)
    })
});
router.post("/replyCustomers",urlencoded,function(req,res){
    var {name,reply} = req.body;
    if(!name){
        req.flash("error_msg","Whom do you want to reply to ?");
        res.redirect("/checkReports")
    }
    if(!reply){
        req.flash("error_msg","There is no valid reply in the Text Box!");
        res.redirect("/checkReports")
    }
    else{
        adminReplies.insertMany({name:name,reply:reply}).then(req.flash("success_msg","Your Message has been successfully sent to the Customer!"),res.redirect("/checkReports")).catch((err)=>{
            console.log(err)
        })
    }
})

module.exports  = router;