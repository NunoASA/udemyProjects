const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String,
});

var Cat = mongoose.model("Cat", catSchema);


// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil",
// })

// george.save(function(err, cat){
//     if(err){
//         console.log("Error");
//     } else {
//         console.log("Done!");
//         console.log(cat)
//     }
// })

Cat.find({}, function(err, cats){
    if(err){
        console.log("oh No, error!")
    } else {
        console.log("All the Cats.. . ")
        console.log(cats)
    }
});

Cat.create({
    name:"Snow White",
    age: 15,
    temperament: "Bland"
}, function(err,cat){
    if(err){
        console.log("error")
    } else {
        console.log("new cat");
        console.log(cat)
    }
})