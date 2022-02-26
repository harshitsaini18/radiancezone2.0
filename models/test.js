const mongoose = require('mongoose');



const testSchema = new mongoose.Schema({
    physics: {
        score: Number,
        complete: Number
    },
    chemistry: {
        score: Number,
        complete: Number
    },
    maths: {
        score: Number,
        complete: Number
    },
    date: String,
    user:String,
    mydate: {
        type: String
    }
})

const test = new mongoose.model("Test", testSchema);
module.exports = test;