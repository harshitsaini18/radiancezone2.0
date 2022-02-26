const mongoose = require('mongoose');
const dburl = "mongodb+srv://priyanshu:priyanshu@cluster0.e4hww.mongodb.net/radiance?retryWrites=true&w=majority"

mongoose.connect(dburl, {  
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    // mongoose.connection
    .then(() => console.log("db Connected"))
    .catch((error) =>
        console.log('you error', error));