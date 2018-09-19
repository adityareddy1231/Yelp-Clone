var express = require("express");
var router = express.Router();
var Place = require("../models/places");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'adityareddy1231',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);


//INDEX - Show all places.
router.get("/", function(req, res) {
  Place.find({}, function(err, allPlaces) {
    if (err) {
      console.log(err);
    } else {
      res.render("places/index", {
        places: allPlaces,
        currentUser: req.user,
        page: 'places'
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
router.post("/", middleware.checkLoggedIn, upload.single('image'), function(req, res) {

//Get geographical details from geocoder and save to variables
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;

    // add cloudinary url for the image to the campground object under image property
    cloudinary.uploader.upload(req.file.path, function(result) {

      //Getting data from form.
      var placeName = req.body.name;
      var placePrice = req.body.price;
      var placeImage = result.secure_url;
      var placeDescription = req.body.description;
      var author = {
        id: req.user._id,
        username: req.user.username
      };

      //Complete the new place object
      var newPlace = {
        name: placeName,
        price: placePrice,
        image: placeImage,
        description: placeDescription,
        author: author,
        location: location,
        lat: lat,
        lng: lng
      };

      // Create a new campground and save to DB
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
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.place.lat = data[0].latitude;
    req.body.place.lng = data[0].longitude;
    req.body.place.location = data[0].formattedAddress;
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
