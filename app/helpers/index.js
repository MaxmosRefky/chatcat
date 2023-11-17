'use strict'

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');
const session = require('../session');
const axios = require('axios');
const https = require('https');
const { response } = require('express');
const url = require('url');
const { error } = require('console');
//const database = Mongoose.db("test");
//const chatusersCollection = db.userModel.collection("chatusers");
//const options = { upsert: false };
const generalPhoto = '/img/profilePic';
var flag = false ;
const updateDoc = {
    $set: {
      profilePic: `/img/profilePic`
    },
  };

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


// let updatePicPhoto = (user) => {
//     //let chatUser = findOne(id);
//     https.get(user.profilePic, (response) => {
//         if(response.statusCode === 200) {
//          console.log('photo exist');
//         }else{
//          db.userModel.updateOne({profileId: user.profileId}, {updateDoc});
//         }
//      });
// }

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
        // getFlag(req.user.profilePic);
        // console.log(flag);
        // if(!flag){
        //     req.user.profilePic = "/img/profilePic.jpg";
        // }
        next();
    }else{
        res.redirect('/');
    }
}

//Find a chatRoom by a given name
let findRoomByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element, index, array) => {
        if(element.room === room) {
            return true;
        } else {
            return false;
        }
    });
    return findRoom > -1 ? true : false;
}

// a function that generates a unique roomID 
let randomHex = () => {
    return crypto.randomBytes(24).toString('hex');
}

//Find a chaRoom with a given ID
let findRoomById = (allrooms, roomID) => {
    return allrooms.find((element, index, array) => {
        if(element.roomID === roomID){
            return true;
        }else{
            return false;
        }
    });
}

// Add a user to a chatroom
let addUserToRoom = (allrooms, data, socket) => {
    //Get the room object
    let getRoom = findRoomById(allrooms, data.roomID);
    if(getRoom !== undefined) {
        //console.log('session: ', socket.request.session);
        // Get the active user's ID (ObjectID as used in session)
        let userID = socket.request.session.passport.user;
        // check to see if this user already exists in chatroom
        let checkUser = getRoom.users.findIndex((element, index, array) => {
            if(element.userID === userID){
                return true;
            }else{
                return false;
            }
        });

        // If the user is allready present in the room, remove him first
        if(checkUser > -1){
            getRoom.users.splice(checkUser, 1);
        }

        //push the user into the room's users array of the chatroom
		getRoom.users.push({
			socketID: socket.id,
			userID,
			user: data.user,
			userPic: data.userPic
		});

        // Join the room channel in porpose 
        socket.join(data.roomID);

        // Return the updated room object
        return getRoom;
    }
}

let removeUserFromRoom =(allrooms, socket) => {
    for(let room of allrooms) {
        //Find the user
        let findUser = room.users.findIndex((element, index, array) => {
            if(element.socketID === socket.id){
                return true;
            }else{
                return false;
            }
        });
        if(findUser> -1){
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        }
    }
}

// async function getFlag(urlPic) {
//     let picUrl = new url.URL(urlPic);
//     try {
//         const respo = await axios.get(picUrl);
//       } catch (error) {
//         console.error('v : ',error);
//         flag = true;
//       } finally{
//         console.log('check pic done');
//       }
// }


// let checkProfilePic1 = (urlPic) => {
//     //let chatUser = findOne(id);
//     let picUrl = new url.URL(urlPic);
//     //let response = await axios.get(picUrl).
//     let flag;
    
//     let axiosResponse = new axios.get(picUrl);
//     console.log(axiosResponse);
//     axiosResponse.then()
// }

// let checkProfilePic2 = (photoUrl) => {
//     const response = axios.get(photoUrl);
//     if(response.PromiseState  === '400'){
//         return true;
//     }else{
//         return false;
//     }
// }


module.exports = {
    route, //you can just use shorthand assignment instand of write :
    // route: route
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
}