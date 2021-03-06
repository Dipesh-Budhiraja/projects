const express = require('express');
var router = express.Router();
const passport = require('passport');
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');

//===========
//AUTH ROUTES
//===========
router.get('/register', function(req, res){
    res.render('register');
});
//handle signup logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.render('register');
        }else{
            passport.authenticate('local')(req, res, function(){
                req.flash('success', 'Welcome to YelpCamp ' + user.username);
                res.redirect('/campgrounds');
            });
        }
    });
});

//show login form
router.get('/login', function(req, res){
    res.render('login');
});

//handling login
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

module.exports = router;
