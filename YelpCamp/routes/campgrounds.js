var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleare = require("../middleware");

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
router.post("/", middleare.isLoggedIn ,function(req, res){
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
            res.redirect("/campgrounds");
        }
    })
})


// NEW
router.get("/new", middleare.isLoggedIn,  function(req, res) {
    res.render("campgrounds/new");
})

// Edit campground Route
router.get("/:id/edit", middleare.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground}); 
    })
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

// Update Campground Route
router.put("/:id", middleare.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//Destroy campground Route
router.delete("/:id", middleare.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})


module.exports = router;