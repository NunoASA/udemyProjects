var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");


// INDEX
router.get("/", function(req,res){
    //get aLL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allcampgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
      }
    })
})


// CREATE
router.post("/", isLoggedIn ,function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    //create a new campground and save in DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect to campgrounds
            console.log(newlyCreated)
            res.redirect("/campgrounds");
        }
    })
})


// NEW
router.get("/new", isLoggedIn,  function(req, res) {
    res.render("campgrounds/new");
})


// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err) 
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
  
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;