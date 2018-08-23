var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Place = require('./models/places'),
  seedDB = require('./seeds'),
  Comment = require('./models/comments');

mongoose.connect("mongodb://localhost/zorros-yelp");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

//Setting default template to ejs.
app.set("view engine", "ejs");

//seeding the database
seedDB();

//HomePage - Main Landing Page
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX - Show all places.
app.get("/places", function(req, res) {
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log(err);
    } else {
      res.render("places/index", {
        places: allPlaces
      });
    }
  });
});

//NEW - Show form to create new place.
app.get("/places/new", function(req, res) {
  res.render("places/new");
});

//CREATE - Add new place to database.
app.post("/places", function(req, res) {

  //Getting data from form.
  var friendlyPlaceName = req.body.name;
  var friendlyPlaceImage = req.body.image;
  var friendlyPlaceDescription = req.body.description;
  var newFriendlyPlace = {
    name: friendlyPlaceName,
    image: friendlyPlaceImage,
    description: friendlyPlaceDescription
  };

  //Passing data to database.
  Place.create(newFriendlyPlace, function(err, justCreatedPlace) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/places");
    }
  });

});

//SHOW - Shows more info about one place.
app.get("/places/:id", function(req, res) {
  //find place by id and populate comments
  Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace) {
      if (err) {
        console.log(err);
      } else {
        res.render("places/show", { place: foundPlace });
      }
  });
});

//Nested NEW route - add new comment for a particular place form
app.get("/places/:id/comments/new", function(req, res) {
  //find places
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { place: place});
    }
  });
});

app.post("/places/:id/comments", function(req, res) {
  //Getting data from form.
  var comment = req.body.comment;
  //finding place
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    } else {
      //adding comment and saving it
      Comment.create(comment, function(err, createdComment) {
        if (err) {
          console.log(error);
        } else {
          place.comments.push(createdComment);
          place.save();
          res.redirect("/places/" + place._id);
        }
      });
    }
  });
});

//Start server on a port on locahost
app.listen(1337, "127.0.0.1", function() {
  console.log("Zorro's yelp server has started!");
});
