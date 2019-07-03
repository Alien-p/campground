const mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment")

const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Description of Cloud's Rest"
    },
    {
        name: "Desert Mesa", 
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        description: "Description of Desert Mesa"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Description of Canyon Floor"
    }
]

const newComment = {
    text: "This place is great, but I wish there was internet",
    author: "Homer"
};

function initDB() {
    //Cleaning CampgroundsDB
    Campground.deleteMany({}, (err) => {
        if(err) {
            console.log(err);
        }

        //Cleaning CommentsDB
        Comment.deleteMany({}, (err) => {
            if(err) {
                console.log(err);
            }

            //Feeling both DBs
            data.forEach(seed => {
                Campground.create(seed, (err, newCamp) => {
                    if(err) {
                        console.log(err);
                    } else {
                        Comment.create(newComment, (err, comment) => {
                            if(err) {
                                console.log(err);
                            } else {
                                newCamp.comments.push(comment);
                                newCamp.save();
                                console.log("DB Initialized")
                            }
                        });
                    }
                });
            });
        });
    });
}

module.exports = initDB;