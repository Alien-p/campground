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
	
	User.register(newUser, req.body.password, (err) => {
		if(err) {
			console.log(err);
			return res.send("error");
		}
		passport.authenticate("local")(req, res, function() {
			console.log("Sign up success");
			return res.redirect("/campgrounds");
		});
	});
 });

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), function(req, res) {
	res.redirect("/");
});

router.get("/logout", (req , res) => {
	req.logOut();
	res.redirect("/campgrounds");
});

module.exports = router;