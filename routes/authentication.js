const express  = require("express");
const router   = express.Router();
const User	   = require("../models/user");
const passport = require("passport");

/**
 * Auth routes
 */
 router.get("/register", (req, res) => {
	res.render("register");
 });

 router.post("/register", (req, res) => {
	const newUser = new User({ username: req.body.username });
	
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			return res.redirect("/campgrounds");
		});
	});
 });

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), function(req, res) {
	req.flash("success", "Welcome to YelpCamp " + req.body.username);
	res.redirect("/campgrounds");
});

router.get("/logout", (req , res) => {
	req.logOut();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
});

module.exports = router;