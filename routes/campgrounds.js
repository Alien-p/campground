const express = require("express");
const router  = express.Router();
const Campground  = require("../models/campground");

/**
 * Camp routes
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

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;