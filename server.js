'use strict';
const express = require('express');
const app = express();
const chatCat = require('./app');
const passport = require('passport');
const fileUpload = require('express-fileupload');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(chatCat.session);
//initialize is a middelware function designed for integration with Express
//it hooks ip passport to the request and response streams that Express provides access
app.use(passport.initialize());

app.use(fileUpload());

//invoke the session middelware function of passport inside passport 
app.use(passport.session());

app.use('/', chatCat.router);//here we sending our routs to see if it's get or post or anything else, and see which
//route we using after (/ , /info, /room, ....ecc)

chatCat.ioServer(app).listen(app.get('port'), ()=>{
    console.log('chatCat running on port ', app.get('port'));
});