require('dotenv').config();

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  mongoose = require("mongoose"),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Place = require('./models/places'),
  seedDB = require('./seeds'),
  Comment = require('./models/comments'),
  User = require('./models/users'),
  session = require('express-session'),
  methodOverride = require('method-override'),
  MongoStore = require('connect-mongo')(session);

//require routes
var placeRoutes = require('./routes/places'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost:27017/zorros-yelp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.locals.moment = require('moment');

//Passport Configuration
app.use(session({
  secret: "Harry Potter is the best fiction book ever",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//using passport
app.use(passport.initialize());
app.use(passport.session());

//setting passport strategy and de/serializing methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing currentUser to all routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//using the routes
app.use("/places", placeRoutes);
app.use("/places/:id/comments", commentRoutes);
app.use(indexRoutes);

//Start server on a port on locahost
app.listen(1337, "127.0.0.1", function() {
  console.log("Zorro's yelp server has started!");
});
