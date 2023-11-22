'use strict';
const passport = require('passport');
const config = require('../config');
const logger = require('../logger');
const h = require('../helpers')
const FacebookStrategy = require('passport-facebook').Strategy;//this statment import the constructor function that internally
//uses the passport OAuth two module to offer authentication and login functionality to your app
//const GoogleStrategy = require("passport-google-oauth2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = () => {//this anonymous function host all our authentication functions to be injected in our main app 
    passport.serializeUser((user, done) => {//this function will be invoked when our authorization process ends
        done(null, user.id);//and it create a session and store the userID inside the session
    });//be carful that is the unique ID that mongoDB give it to the user not the facebook id

    passport.deserializeUser((id, done) => {
        //h.updatePicPhoto(id);
        //Find the user using the _id
        h.findById(id)
        .then(user => done(null, user))
        .catch(error => logger.log('error','Errore when deserializeUser new user '+ error));
    });


    let authProcessor = (accessToken, refreshToken, profile, done) => {
        //done : get the data out of the authentication process and into the rest of the workflow within our app
        //Find a user in the local db using profile.id
        //If the user is found, return the user data using the done()
        //If the user is not found, create one in the local db and return
        h.findOne(profile.id)
        .then(result => {
            if(result){
                done(null, result);//null will be set to receive an error in the standard NodeJS
            } else {
                //we have to create user now and return  
                h.createNewUser(profile)
                .then(newChatUser => done(null, newChatUser)
                .catch(error => logger.log('error','Errore when creating new user'+ error)));
            }
        });
    }
    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
    passport.use(new GoogleStrategy(config.google, authProcessor));
    //FacebookStrategy require two things  :
    //1) configration providers access to the appID , appSecret, callbackURL
    // and optionally an array with the desired user data keys  ecc.......
    //2) callback function that is invoked once the control comes back tp passport 
    //after the authentication process is done 
}