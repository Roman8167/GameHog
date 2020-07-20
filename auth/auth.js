module.exports = {
    checkAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        else{
            req.flash('error_msg',"Please Log In to view the Page")
            res.redirect("/login")
        }
    }
}