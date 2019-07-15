/* eslint-disable space-in-parens */
/* eslint-disable indent */
const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const passport	  = require("passport");
const LocalStrategy = require("passport-local");
const User 			= require("./models/user");
const Campground  = require("./models/campground");
const Comment     = require("./models/comment");
const seedDB      = require("./seeds");
const session 	  = require("express-session");

seedDB();

// mongoose
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded( { extended: true }));
app.use(express.static( __dirname + "/public" ));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
	secret: "Altay is white",
	resave: false,
	saveUninitialized: false
}));
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/**
 * Campgrounds routes
 */
app.get( "/", ( req, res ) => {
	res.redirect( "/campgrounds" );
} );

// INDEX - show all campgrounds
app.get( "/campgrounds", ( req, res ) => {
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
app.post( "/campgrounds", isLoggedIn, ( req, res ) => {
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
app.get( "/campgrounds/new", isLoggedIn, function( req, res ) {
	res.render( "campgrounds/new" ); 
} );

// SHOW - shows more info about one campground
app.get( "/campgrounds/:id", isLoggedIn, ( req, res ) => {
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

app.post( "/campgrounds/:id", isLoggedIn, ( req, res ) => {
	const newComment = req.body.comment;

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

 app.get("/register", (req, res) => {
	res.render("register");
 });

 app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), function(req, res) {

});

app.get("/logout", (req , res) => {
	req.logOut();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen( 8000, () => {
	console.log( "The YelpCamp Server Has Started!" );
} );