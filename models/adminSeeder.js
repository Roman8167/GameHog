const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/admin-page";
const adminSchema = require("../models/adminSchema")
mongoose.connect(url,function(err,db){
    if(err) throw err;
    console.log("Connected to the admin-table");
});
const newAdmin = [new adminSchema({
    username:"myAdmin",
    isAdmin:true,
    adminCode:1599
})];
var done = 0;
for(var i=0;i<newAdmin.length;i++){
    newAdmin[i].save(function(err,result){
        if(err) throw err;
        if(done==newAdmin.length){
            mongoExit()
        }
    })
}
function mongoExit(){
    mongoose.disconnect()
}