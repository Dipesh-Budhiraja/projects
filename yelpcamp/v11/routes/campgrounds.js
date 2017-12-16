const express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware/index.js');


//INDEX - show all campgrounds
router.get('/', function(req, res){
    // get all the campgrounds from db
    // console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("error");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - add new campground
router.post('/', middleware.isLoggedIn, function(req, res){
    //redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new", {currentUser: req.user});
});

//SHOW - shows more info about one campground
//always place this below the new
router.get('/:id', function(req, res){
    //find the campground with provided id
    //render show template with that campground
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground, currentUser: req.user});
        }
    });
});

//edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership,function(req, res){
    //is user logged in at all?
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render('campgrounds/edit', {campground: foundCampground, currentUser: req.user});
        });
    //otherwise also redirect
    //if not, redirect
});
//update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    //redirect to show page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;
