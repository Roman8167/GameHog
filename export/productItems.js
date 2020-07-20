const mongodb = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/products";
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("gameItems.csv")
///connecting to mongodb;
mongodb.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("products");
    var products =  dbo.collection("gameitems")
    products.find({}).toArray(function(err,results){
        fastcsv.write(results,{headers:true}).on("finish",function(){
           console.log("Converted...") 
        }).pipe(ws)
    })
})