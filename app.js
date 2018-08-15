var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dogFriendlyPlaces = [{
    name: "Salmon Creek",
    image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"
  },
  {
    name: "Yosemite National",
    image: "https://farm8.staticflickr.com/7272/7700546096_f39d724392.jpg"
  },
  {
    name: "Horsetooth Reservoir",
    image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"
  },
  {
      name: "Salmon Creek",
      image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"
    },
    {
      name: "Yosemite National",
      image: "https://farm8.staticflickr.com/7272/7700546096_f39d724392.jpg"
    },
    {
      name: "Horsetooth Reservoir",
      image: "https://farm3.staticflickr.com/2931/14128269785_f27fb630f3.jpg"
    }
];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/friendly-places", function(req, res) {
  res.render("friendly-places", {
    dogFriendlyPlaces: dogFriendlyPlaces
  });
});

app.get("/friendly-places/new", function(req, res) {
  res.render("new");
});

app.post("/friendly-places", function(req, res) {
  var friendlyPlaceName = req.body.name;
  var friendlyPlaceImage = req.body.image;
  var newFriendlyPlace = {
    name: friendlyPlaceName,
    image: friendlyPlaceImage
  };
  dogFriendlyPlaces.push(newFriendlyPlace);
  res.redirect("/friendly-places");
});

app.listen(1337, "127.0.0.1", function() {
  console.log("Zorro's yelp server has started!");
});
