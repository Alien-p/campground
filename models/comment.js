const  mongoose = require("mongoose");

const commentSchem = new mongoose.Schema({
    text: String,
    aouthor: String
});


module.exports = mongoose.model("Comment", commentSchem);