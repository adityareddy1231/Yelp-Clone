var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/zorros-yelp");

var placeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var place = mongoose.model("Place", placeSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

//Setting default template to ejs.
app.set("view engine", "ejs");

//HomePage - Main Landing Page
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX - Show all places.
app.get("/places", function(req, res) {
  place.find({}, function(err, allPlaces) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        places: allPlaces
      });
    }
  });
});

//NEW - Show form to create new place.
app.get("/places/new", function(req, res) {
  res.render("new");
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
  place.create(newFriendlyPlace, function(err, justCreatedPlace) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/places");
    }
  });
});

//SHOW - Shows more info about one place.
app.get("/places/:id", function(req, res) {
  //find place by id
  place.findById(req.params.id, function(err, foundPlace) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { place: foundPlace });
      }
  });
});

//Start server on a port on locahost
app.listen(1337, "127.0.0.1", function() {
  console.log("Zorro's yelp server has started!");
});
