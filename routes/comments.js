const express = require("express");
const router  = express.Router();
const Campground  = require("../models/campground");
const Comment     = require("../models/comment");

/**
 * Comments routes
 */
router.post( "/campgrounds/:id", isLoggedIn, ( req, res ) => {
	const newComment = req.body.comment;
	newComment.author = req.user.username;

	Comment.create( newComment, ( err, createdComment ) => {
		if( err ) {
			console.log( err );
		} else {
			Campground.findById( req.params.id ).populate( "comments" ).exec( ( err, foundCampground ) => {
				if( err ) {
					console.log( err );
				} else {
					foundCampground.comments.push( createdComment );
                    foundCampground.save();
                    res.redirect( "/campgrounds/" + req.params.id );
				}
			});
		}
	} );
} );

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;