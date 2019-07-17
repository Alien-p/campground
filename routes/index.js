const express = require("express");
const router  = express.Router();


/**
 * Campgrounds routes
 */
router.get( "/", ( req, res ) => {
	res.redirect( "/campgrounds" );
} );

// INDEX - show all campgrounds
router.get( "/campgrounds", ( req, res ) => {
	// Get all campgrounds from DB
	Campground.find( {}, ( err, allCampgrounds ) => {
		if ( err ) {
			console.log( err );
		} else {
			res.render( "campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user } );
		}
	} );
} );

// CREATE - add new campground to DB
router.post( "/campgrounds", isLoggedIn, ( req, res ) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc };
    
	// Create a new campground and save to DB
	Campground.create( newCampground, ( err ) => {
		if( err ) {
			console.log( err );
		} else {
			// redirect back to campgrounds page
			res.redirect( "/campgrounds" );
		}
	} );
} );

// NEW - show form to create new campground
router.get( "/campgrounds/new", isLoggedIn, function( req, res ) {
	res.render( "campgrounds/new" ); 
} );

// SHOW - shows more info about one campground
router.get( "/campgrounds/:id", isLoggedIn, ( req, res ) => {
	// find the campground with provided ID
	Campground.findById( req.params.id ).populate( "comments" ).exec( function( err, foundCampground ) {
		if( err ) {
			console.log( err );
		} else {
			// render show template with that campground
			res.render( "campgrounds/show", { campground: foundCampground } );
		}
	} );
} );

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
			} );
		}
	} );

	
} );

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

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}