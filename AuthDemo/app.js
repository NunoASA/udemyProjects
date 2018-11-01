var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    //models
    User                    = require("./models/user")

mongoose.connect("mongodb://localhost/auth_demo_app", {useNewUrlParser: true, useFindAndModify: false});


//=============== Configurations ========================
var app = express();

app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Set passport Up
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//======================================================


//============
// Routes
//============

app.get("/", function(req, res){
    res.render("home");
})

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
})

// Auth Routes

// Show form
app.get("/register", function(req, res){
    res.render("register")
})

// Handling user signUp
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
})

//Logins Route

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){})

//Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();    
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server AUTH Started . . .")
})