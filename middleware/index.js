const Campground  	= require("../models/campground");
const Comment      	= require("../models/comment");
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please Login First!")
	res.redirect("/login");
}

middlewareObj.checkCampOwner = function (req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				req.flash("error", "Campground does not exist");
				res.redirect("back");
			} else if(foundCampground.author.id.equals(req.user._id)) {
				return next();
			} else {
				req.flash("error", "You don't have parmission to do that");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "Please Login First!")
		res.redirect("back");
	}
}

middlewareObj.checkCommentsOwner = function (req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				console.log(err);
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					return next();
				} else {
					res.redirect("back");
				}
			}
		})
	}
}

module.exports = middlewareObj