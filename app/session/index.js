'use strict';
const session =  require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if(process.env.NODE_ENV === 'production'){//to check if our execution envirnoment is production or not
    //Initialize session with settings for production
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db.Mongoose.connection  
        })//where express store the session data, because if you don't spicify store , Express will storet in memory ,
        //while that can work in development , but absolutely not recommended for production , since in memory
        //will not scal and would end your server easily
    });
    
}else{
    //Initialize session with settings for dev
    module.exports = session({
        secret: config.sessionSecret,
        resave: false, //if it's true , so our middelware will attempt to store the session data again and again
        // into our session store even if the data in the session has not changed
        saveUninitialized: true,//this option will create a session cookie in the user's browser as well as the associated
        //entry in the session store , even when the session has not been Initialized with any data
        maxAge: 86400000
    });
}