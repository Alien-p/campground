/* eslint-disable space-in-parens */
/* eslint-disable indent */
const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const seedDB      = require("./seeds");
const session 	  = require("express-session");
const campRoutes    = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/authentication");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User	   = require("./models/user");


//passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

//app config
app.use(bodyParser.urlencoded( { extended: true }));
app.set("view engine", "ejs");
app.use(express.static( __dirname + "/public" ));
seedDB();

app.use(session({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(campRoutes);
app.use(commentRoutes);
app.use(authRoutes);


app.listen( 8000, () => {
	console.log( "The YelpCamp Server Has Started!" );
} );