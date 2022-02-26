const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const user = require("../models/signup");
require("dotenv").config();

async function auth(req, res, next) {
  try {
    const client = new OAuth2Client(process.env.GCLIENT_ID);
    let token = req.cookies.jwt;
    let gtoken = req.cookies.gtoken;
    

    try {
      const ticket = await client.verifyIdToken({
        idToken: gtoken,
        audience: process.env.GCLIENT_ID,
      });

      let data = ticket.getPayload();
      // console.log(data);
      req.rootUser = data;
    } 
    
    catch (error) {
      console.log(error);
      let verToken = jwt.verify(token, process.env.SECRET_KEY || 'Make sure not to use the same secret phrase in both places!');
      let mainUser = await user.findOne({
        _id: verToken,
        "tokens.token": token,
      });
      req.rootUser = mainUser;
    }


    next();
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = auth;
