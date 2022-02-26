const mongoose = require('mongoose'); 


  
 const dppSchema = new mongoose.Schema({
        subject: String,
        score: Number,
        complete: Number,
        date:  String,
        user:String,
        mydate: {
          type: Date,
          default: new Date
      }
          
 })

 const dpp = new mongoose.model("Dpp",dppSchema);
 module.exports = dpp;