'use strict';
const config = require('../config');
const logger = require('../logger');
const Mongoose = require('mongoose');

Mongoose.connect(config.dbURI, { //connect mongoose to our dataBase
    useNewUrlParser: true},)
    .then(() => console.log("Connected successfully"))
    .catch((error) => {logger.log('error', 'Mongoose connection error ,'+ error)});//Log an error if the connection fails

//different 2 ways to Log errors but it doesn't work : 
// first :
// try {
//     await Mongoose.connect(config.dbURI, { useNewUrlParser: true });
// } catch (error) {
//     console.error(error);
// }
//second :
// Mongoose.connect(config.dbURI, function(err) {
//     if (err) throw err;
// });
// Log an error if the connection fails
// Mongoose.connection.on('erorr', error => {
//     console.log("MongoDB Errore: ", error);
// });

//Create a Schema that defines the structure for storing user data :
const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

//Turning the schema into a usable model to make it possibile to make an istance of this schema
let userModel = Mongoose.model('chatUser', chatUser)


module.exports = {
    Mongoose,
    userModel
}
