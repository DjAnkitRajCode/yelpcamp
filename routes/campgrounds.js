var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX-show all campgrounds
router .get("/",function(req,res){
    //get all campground from DB
    campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});


//CREATE - add new campground to DB
router .post("/", middleware.isLoggedIn, function(req,res){
    //get data from form and add to compounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price:price, image: image, description: description, author:author}
    //create a new campground and save to data base
    campground.create(newCampground ,function(err ,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campground page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - Show form to create new campground
router .get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW - Show info about one particular campground which is clicked/selected
router .get("/:id",function(req,res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});
//EDIT campground ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

//UPDATE campground  ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTORY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;