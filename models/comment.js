const  mongoose = require("mongoose");

const commentSchem = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: String
});


module.exports = mongoose.model("Comment", commentSchem);