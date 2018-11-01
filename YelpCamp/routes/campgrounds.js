var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");


// INDEX
router.get("/campgrounds", function(req,res){
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
router.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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
router.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
})


// SHOW
router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err) 
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
  
})

module.exports = router;