var Place = require("../models/places");
var Comment = require("../models/comments");

//all the middleware
var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Place.findById(req.params.id, function(err, foundPlace) {
      if (err) {
        res.redirect("back");
      } else {
        //check user ownership of place
        if (foundPlace.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentID, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        //check user ownership of comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
