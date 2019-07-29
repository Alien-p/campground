const express 	  = require("express");
const router  	  = express.Router();
const Campground  = require("../models/campground");
const middleware   = require("../middleware/index");

/**
 * Camp routes
 */
router.get( "/", ( req, res ) => {
	res.render( "landing" );
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
router.post( "/campgrounds", middleware.isLoggedIn, ( req, res ) => {
	// get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	const desc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	}

	const newCampground = { name: name, image: image, description: desc, author: author};
    
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
router.get( "/campgrounds/new", middleware.isLoggedIn, function( req, res ) {
	res.render( "campgrounds/new" ); 
} );

// SHOW - shows more info about one campground
router.get( "/campgrounds/:id", ( req, res ) => {
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

//EDIT campground
router.get("/campgrounds/:id/edit", middleware.checkCampOwner, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

router.put("/campgrounds/:id", middleware.checkCampOwner, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY campground
router.delete("/campgrounds/:id", middleware.checkCampOwner, (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;