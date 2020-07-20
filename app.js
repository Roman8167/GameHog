const express = require("express");
const app = express();
const passport = require("passport");
const router = require("./routes/routes");
const router2 = require("./routes/users");
const router3 = require("./routes/index");
const router4 = require("./routes/admin");
const router5 = require("./routes/chatbot");
const session = require("express-session");
const cookieParser = require("cookie-parser")
const flash = require("connect-flash");
const {ensureAuthenticated} = require("./auth/auth")
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true,
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error")
    next()
})
app.use(cookieParser())
app.use("/",router);
app.use("/",router2);
app.use("/",router3);
app.use("/",router4);
app.use("/",router5)
const ejs = require("ejs");
app.set("view engine","ejs");
app.use(express.static("./views"))
const port = 3000;
app.listen(port,()=>{
    console.log(`Server is up and running at port ${port}`)
})