const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


function connection() {
        mongoose.connect("mongodb://127.0.0.1:27017/chammzzz");
}





module.exports = { connection };