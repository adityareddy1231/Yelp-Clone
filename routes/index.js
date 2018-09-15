var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require("../models/users");

//HomePage - Main Landing Page
router.get("/", function(req, res) {
  res.render("landing");
});

//show registration form
router.get("/register", function(req, res) {
  res.render("register", {page: 'register'});
});

//handle signup logic
router.post("/register", function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to Zorro's-Yelp " + user.username);
      res.redirect("/places");
    });
  });
});

//show login form
router.get("/login", function(req, res) {
  res.render("login", {page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
 req.logout();
 req.flash("success", "Logged You Out!");
 res.redirect("/places");
});

module.exports = router;
