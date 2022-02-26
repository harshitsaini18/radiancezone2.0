const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    tokens:[
        {token:String}
    ]
})

userSchema.pre("save",async function (next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,12);
    }
    next()
})
userSchema.methods.generateAuthToken = async function() {
    try {
        // console.log("my token ",process.env.SECRET_KEY)
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
    
}
const user = new mongoose.model("User", userSchema);
module.exports = user;