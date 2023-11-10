'use strict';

const session = require('./session');


//Social Authentication Logic
require('./auth')();

// create an IO server instance
let ioServer = app => {
    app.locals.chatrooms = [];
    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    // io.use((socket, next) => {
    //     require('./session')(socket.request, {}, next);
    // });
    io.engine.use(session);
    require('./socket')(io,app);
    return server;
}

module.exports = {
    router: require('./routes')(),
    session: require('./session'),
    ioServer
}
// const router = require('express').Router();//this is at the top of every sub 
// //application that you create withen the umbrella of you core express application
//Router here is an istance of medelware function 


// router.get('/', (req, res, next) => {
//     res.render('login');
// });


// router.get('/info', (req, res, next) => {
//     res.send('Test page');//just for testing
// });

// module.exports = {
//     router: require('./routes')(), //this is make me no need any more for {const router = require('express').Router();} or
//     // {router.get('/', (req, res, next) => {
//         // res.render('login');
//         //});
//     //}
//     session: require('./session')
// }
