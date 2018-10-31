var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds")
    
    
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")


// Campground.create(
//     {
//         name: "Lepe Beach Campsite, Hampshire",
//         image: "https://www.telegraph.co.uk/content/dam/Travel/2017/May/camping-Lepe-Beach.jpg?imwidth=960",
//         description: "If a waterside campsite floats your boat, Lepe Beach is tough to top. Yards from the sandand shingle Hampshire coast, this brand new campsite offers salty sea views of the Isle of Wight and, to the east, the sand flats of the Solent National Nature Reserve. The focus here is on traditional camping: pitches are flat, ablutions kept immaculately clean and campfiresare welcomed in the pits available." 
        
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created Campground: ");
//             console.log(campground);
//         }
//     });


app.get("/", function(req, res){
    res.render("landing")
})


// INDEX
app.get("/campgrounds", function(req,res){
    //get aLL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allcampgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("index", {campgrounds: allcampgrounds});
      }
    })
})


// CREATE
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})


// SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err) 
        } else {
            console.log(foundCampground)
            res.render("show", {campground: foundCampground});
        }
    })
  
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!");
})