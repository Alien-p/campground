const express = require("express");
const router  = express.Router();
const Campground  = require("../models/campground");
const Comment     = require("../models/comment");

/**
 * Comments routes
 */

 //Add new comment rout
router.post( "/campgrounds/:id", isLoggedIn, (req, res) => {
	const newComment = new Comment(
		{
			text: req.body.comment.text,
			author: {
				id: req.user.id,
				username: req.user.username
			},
			date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
		});


	Comment.create(newComment, (err, createdComment) => {
		if(err) {
			console.log(err);
		} else {
			Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
				if(err) {
					console.log(err);
				} else {
					foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
} );

//Update and delete comment routs
router.delete("/campgrounds/:id/:comment_id", checkCommentsOwner, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, (err) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});

});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	}
	res.redirect("back");
}

function checkCommentsOwner(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				console.log(err);
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	}
}

module.exports = router;