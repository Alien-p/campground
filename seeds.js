/* eslint-disable space-in-parens */
const Campground = require("./models/campground");
const Comment 	 = require("./models/comment");

const data = [
	{
		name: "Cloud's Rest", 
		image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		description: "Bacon ipsum dolor amet prosciutto turducken shankle tri-tip shank venison pastrami porchetta andouille. Capicola pastrami porchetta, flank ribeye beef ribs tail beef. Landjaeger pork belly swine beef ribs chicken pancetta cow pig jowl boudin cupim meatball pork chop tongue kevin. Meatball turducken flank biltong landjaeger prosciutto chuck venison beef ribs corned beef andouille. Chuck sausage tail chicken pancetta, jerky ham hock porchetta t-bone doner biltong turkey bacon. Kevin tail alcatra pastrami pork belly cupim brisket biltong pancetta t-bone beef cow chuck ribeye fatback."
	}
];

function initDB() {
	//Cleaning CampgroundsDB
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		}

		//Cleaning CommentsDB
		Comment.deleteMany({}, (err) => {
			if (err) {
				console.log(err);
			}
			
			// Feeling both DBs
			data.forEach(seed => {
				Campground.create(seed, (err, newCamp) => {
					if (err) {
						console.log(err);
					}
				});
			});
			console.log("DB Initializing completed");
		});
	});
}

module.exports = initDB;