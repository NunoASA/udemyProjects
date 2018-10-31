var mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    express     = require("express"),
    app         = express();

//  App Config
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose/Model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);


// RESTful Routes

app.get("/", function(req, res){
    res.redirect("/blogs")
})


// Index
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
})

// New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
})

//Create Route
app.post("/blogs", function(req, res){
    // create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
})


// Show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running!")
})