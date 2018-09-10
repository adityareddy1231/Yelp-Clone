var express = require("express");
var router = express.Router({mergeParams: true});
var Place = require("../models/places");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//comments - new
router.get("/new", middleware.checkLoggedIn, function(req, res) {
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
router.post("/", middleware.checkLoggedIn, function(req, res) {
  //finding place
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
      req.flash("error", "Place not found in the database!");
    } else {
      Comment.create(req.body.comment, function(err, createdComment) {
        if (err) {
          console.log(error);
          req.flash("error", "Couldn't create a new review!");
        } else {
          //add username and id to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          //save comment
          createdComment.save();
          //push comments to the place
          place.comments.push(createdComment);
          //save the place
          place.save();
          req.flash("success", "Successfully added a new review!");
          res.redirect("/places/" + place._id);
        }
      });
    }
  });
});

//comments - show edit page,
router.get("/:commentID/edit", middleware.checkCommentOwnership, function(req, res) {
  Place.findById(req.params.id, function(err, foundPlace) {
    if (err || !foundPlace) {
      req.flash("error", "Place not found in database");
      return res.redirect('back');
    }
    Comment.findById(req.params.commentID, function(err, foundComment) {
      if (err) {
        res.redirect("back");
        req.flash("error", "Couldn't find the review in the database");
      }  else {
        res.render("comments/edit", {place_id: req.params.id, comment: foundComment});
      }
    });
  });
});

//comments - put - update database
router.put("/:commentID", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, updatedComment) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("back");
    }  else {
      req.flash("success", "Successfully edited the review!");
      res.redirect("/places/" + req.params.id);
    }
  });
});

//coments - destroy route
router.delete("/:commentID", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.commentID, function(err) {
    if (err) {
      req.flash("error", "Something went wrong!");
      console.log(err);
    } else {
      req.flash("success", "Successfully deleted the review!");
      res.redirect("/places/" + req.params.id);
    }
  });
});

module.exports = router;
