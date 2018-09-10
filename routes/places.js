var express = require("express");
var router = express.Router();
var Place = require("../models/places");
var middleware = require("../middleware");

//INDEX - Show all places.
router.get("/", function(req, res) {
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log(err);
    } else {
      res.render("places/index", {
        places: allPlaces,
        currentUser: req.user
      });
    }
  });
});

//NEW - Show form to create new place.
router.get("/new", middleware.checkLoggedIn, function(req, res) {
  Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace) {
    if (err) {
      res.redirect("/places");
    } else {
      res.render("places/new", {
        place: foundPlace
      });
    }
  });
});

//CREATE - Add new place to database.
router.post("/", middleware.checkLoggedIn, function(req, res) {

  //Getting data from form.
  var placeName = req.body.name;
  var placePrice = req.body.price;
  var placeImage = req.body.image;
  var placeDescription = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newPlace = {
    name: placeName,
    price: placePrice,
    image: placeImage,
    description: placeDescription,
    author: author
  };

  //Passing data to database.
  Place.create(newPlace, function(err, justCreatedPlace) {
    if (err) {
      req.flash("error", "Something went wrong!");
      console.log(err);
    } else {
      req.flash("success", "Successfully added a new place!");
      res.redirect("/places");
    }
  });

});

//SHOW - Shows more info about one place.
router.get("/:id", function(req, res) {
  //find place by id and populate comments
  Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace) {
    if (err || !foundPlace) {
      req.flash("error", "Place not found in the database");
      res.redirect("back");
    } else {
      res.render("places/show", {
        place: foundPlace
      });
    }
  });
});

//EDIT - campground route
router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res) {
  Place.findById(req.params.id, function(err, foundPlace) {
    if (err || !foundPlace) {
      req.flash("error", "Place not found in the database");
      res.redirect("back");
    } else {
        res.render("places/edit", {
        place: foundPlace
      });
    }
  });
});

//Update campground route
router.put("/:id", middleware.checkPlaceOwnership, function(req, res) {
  Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/places");
    } else {
      req.flash("success", "Successfully edited place details!");
      res.redirect("/places/" + updatedPlace._id);
    }
  });
});

//Destroy campground route
router.delete("/:id", middleware.checkPlaceOwnership, function(req, res) {
  Place.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/places");
    } else {
      req.flash("success", "Successfully deleted the place!");
      res.redirect("/places");
    }
  });
});

module.exports = router;
