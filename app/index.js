'use strict';

//Social Authentication Logic
require('./auth')();


module.exports = {
    router: require('./routes')(),
    session: require('./session')
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
