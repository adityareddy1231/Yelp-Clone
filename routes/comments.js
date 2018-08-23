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
  //finding place
  Place.findById(req.params.id, function(err, place){
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, createdComment) {
        if (err) {
          console.log(error);
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
          res.redirect("/places/" + place._id);
        }
      });
    }
  });
});

//comments - show edit page
router.get("/:commentID/edit", checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.commentID, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    }  else {
      res.render("comments/edit", {place_id: req.params.id, comment: foundComment});
    }
  });
});

//comments - put - update database
router.put("/:commentID", checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    }  else {
      res.redirect("/places/" + req.params.id);
    }
  });
});

//coments - destroy route
router.delete("/:commentID", checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.commentID, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/places/" + req.params.id);
    }
  });
});

function checkCommentOwnership(req, res, next) {
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
}

function checkLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
