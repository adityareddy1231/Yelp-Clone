var Place = require("../models/places");
var Comment = require("../models/comments");

//all the middleware
var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Place.findById(req.params.id, function(err, foundPlace) {
      if (err || !foundPlace) {
        req.flash("error", "Place not found in the database!");
        res.redirect("back");
      } else {
        //check user ownership of place
        if (foundPlace.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentID, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Review not found in the database!");
        res.redirect("back");
      } else {
        //check user ownership of comment
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};

middlewareObj.checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;
