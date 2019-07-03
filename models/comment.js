const  mongoose = require("mongoose");

const commentSchem = new mongoose.Schema({
    text: String,
    author: String
});


module.exports = mongoose.model("Comment", commentSchem);