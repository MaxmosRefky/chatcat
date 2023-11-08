'use strict'

const router = require('express').Router();
const db = require('../db');

//if i understand correctly , what we doing here is , resgistring every router (end-point) and the handlers belong  into express,
//like this when we call (require) this module , we will find all routes ready to use . 
let _resgisterRoutes = (routes, method) => {
    for(let key in routes) {
        if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)){
            _resgisterRoutes(routes[key], key);
        } else {
            //Register the routes
            if(method === 'get'){
                router.get(key, routes[key]);
            }else if(method === 'post') {
                router.post(key, routes[key]);
            }else {
                router.use(routes[key]);
            }
        }
    }
}

let route = routes => {
    _resgisterRoutes(routes);
    return router;
}

// Find a single user based on a key
let findOne = profileID => {//input
    return db.userModel.findOne({//return, this method (findOne) return a Promise
        'profileId': profileID
    })
}

//create a new user and return that instance
let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });
        newChatUser.save(error =>{
            if(error){
                reject(error);
            }else{
                resolve(newChatUser);
            }
        });
    });
}

let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if(error){
                reject(error);
            }else{
                resolve(user);
            }
        });
    });
}

//a middleware that checks to see if the user is authenicated & logged in
let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){//req.isAuthenticated  provited by passport and return true if user indeed logged in
        next();
    }else{
        res.redirect('/');
    }
} 

module.exports = {
    route, //you can just use shorthand assignment instand of write :
    // route: route
    findOne,
    createNewUser,
    findById,
    isAuthenticated
}