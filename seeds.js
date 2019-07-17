/* eslint-disable space-in-parens */
const Campground = require( "./models/campground" );
const Comment 	 = require("./models/comment");

const data = [
	{
		name: "Cloud's Rest", 
		image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		description: "Bacon ipsum dolor amet prosciutto turducken shankle tri-tip shank venison pastrami porchetta andouille. Capicola pastrami porchetta, flank ribeye beef ribs tail beef. Landjaeger pork belly swine beef ribs chicken pancetta cow pig jowl boudin cupim meatball pork chop tongue kevin. Meatball turducken flank biltong landjaeger prosciutto chuck venison beef ribs corned beef andouille. Chuck sausage tail chicken pancetta, jerky ham hock porchetta t-bone doner biltong turkey bacon. Kevin tail alcatra pastrami pork belly cupim brisket biltong pancetta t-bone beef cow chuck ribeye fatback."
	},
	{
		name: "Desert Mesa", 
		image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
		description: "Kevin meatloaf pig, alcatra pork tail shankle capicola venison. Frankfurter alcatra rump chuck biltong ground round meatloaf picanha cow ham hock venison filet mignon cupim tri-tip. Tongue filet mignon pork, sausage rump bacon flank short loin t-bone. Buffalo pork chop spare ribs, turkey pancetta shank tail doner swine boudin."
	},
	{
		name: "Canyon Floor", 
		image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
		description: "Pork loin beef ribs picanha, cupim turducken ribeye capicola salami pork chop brisket prosciutto cow alcatra ham hock bresaola. Jowl kielbasa pork belly frankfurter ham burgdoggen. Tail porchetta ham strip steak kevin jerky beef swine tenderloin spare ribs sirloin. Landjaeger doner rump, prosciutto kevin tongue kielbasa spare ribs. Tenderloin boudin pastrami short loin. Pork pastrami shankle ham hamburger venison cupim kielbasa pork belly."
	}
];

const newComment = {
	text: "This place is great, but I wish there was internet",
	author: "Homer"
};

function initDB() {
	//Cleaning CampgroundsDB
	Campground.deleteMany( {}, ( err ) => {
		if ( err ) {
			console.log( err );
		}

		//Cleaning CommentsDB
		Comment.deleteMany( {}, ( err ) => {
			if ( err ) {
				console.log( err );
			}
			
			//Feeling both DBs
			data.forEach( seed => {
				Campground.create( seed, ( err, newCamp ) => {
					if ( err ) {
						console.log( err );
					} else {
						Comment.create( newComment, ( err, comment ) => {
							if ( err ) {
								console.log ( err );
							} else {
								newCamp.comments.push( comment );
								newCamp.save();
							}
						});
					}
				});
			});
		});
	});
	console.log( "DB Initialized" );
}

module.exports = initDB;