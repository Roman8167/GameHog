///for customer orders and tables
const mongodb = require("mongodb").MongoClient;
const fastCsv = require("fast-csv");
const fs = require("fs");
const url = "mongodb://localhost:27017/mydb";
const ws = fs.createWriteStream("customer-orders.csv");
mongodb.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("products");
    var customerTables = dbo.collection("customer-tables");
    customerTables.find({}).toArray(function(err,data){
        if(err) throw err;
        fastCsv.write(data,{headers:true}).on("finish",function(){
            console.log("The File is converted")
        }).pipe(ws)
    })
})