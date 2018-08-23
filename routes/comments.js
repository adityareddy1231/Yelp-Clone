var express = require("express");
var router = express.Router({mergeParams: true});
var Place = require("../models/places");
var Comment = require("../models/comments");

//comments - new
router.get("/new", checkLoggedIn, function(req, res) {
  //find places
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { place: place});
    }
  });
});

//comments - create
router.post("/", checkLoggedIn, function(req, res) {
  //Getting data from form.
  var comment = req.body.comment;
  //finding place
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    } else {
      Comment.create(comment, function(err, createdComment) {
        if (err) {
          console.log(error);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //push comments to the place
          place.comments.push(createdComment);
          //save the place
          place.save();
          res.redirect("/places/" + place._id);
        }
      });
    }
  });
});

function checkLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
