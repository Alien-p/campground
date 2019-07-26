const express = require("express");
const router  = express.Router();
const Campground  = require("../models/campground");
const Comment     = require("../models/comment");
const middleware   = require("../middleware/index");
/**
 * Comments routes
 */

 //Add new comment rout
router.post( "/campgrounds/:id", middleware.isLoggedIn, (req, res) => {
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
router.delete("/campgrounds/:id/:comment_id", middleware.checkCommentsOwner, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, (err) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});

});


module.exports = router;

function reverseInt(num) {
	num = num + "";
	let revertedNum = "";
	
	for (let i = num.length-1; i >= 0; i--) {
		revertedNum += num[i];
	}
	if(num.slice(-1) == "-") {
		num = "-" + num;
		num.substr(revertedNum.length-1);
	}
	return Number(revertedNum);
}