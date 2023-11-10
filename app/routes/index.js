'use strict';

const router = require('express').Router();
const passport = require('passport');
const h = require('../helpers');
const config = require('../config');

//here our routers are decleared as key value pairs where 
//the key is the route and the value is the route handler function 

module.exports = ()=>{
    let routes = {
        'get': {
            '/': (req, res, next) => {
                res.render('login');
            },
            '/rooms': [h.isAuthenticated, (req, res, next) => {
                res.render('rooms',{
                    user: req.user,
                    host: config.host
                });
            }],
            '/chat/:id': [h.isAuthenticated, (req, res, next) => {
                //Find a chatroom with the given id
                // Render it if the id is found
                let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
                if(getRoom === undefined){
                    return next();
                }else{
                    res.render('chatroom',{
                        user: req.user,
                        host: config.host,
                        room: getRoom.room,
                        roomID: getRoom.roomID
                    });
                }
            }],
            '/auth/facebook': passport.authenticate('facebook'),
            '/auth/facebook/callback': passport.authenticate('facebook', {
                successRedirect: '/rooms',//if authentication succeed
                failureRedirect:'/'//if authentication faild
            }),
            '/auth/twitter': passport.authenticate('twitter'),
            '/auth/twitter/callback': passport.authenticate('twitter', {
                successRedirect: '/rooms',//if authentication succeed
                failureRedirect:'/'//if authentication faild
            }),
            '/auth/google': passport.authenticate('google', {scope: ['email', 'profile']}),
            '/auth/google/callback': passport.authenticate('google', {
                successRedirect: '/rooms',//if authentication succeed
                failureRedirect:'/'//if authentication faild
            }),
            '/logout': function(req, res, next) {
                req.logout(function(err) {
                  if (err) { return next(err); }
                  res.redirect('/');
                });
              }
            ,
            '/getsession': (req, res, next) => {
                res.send("My favourite color: " + req.session.favColor);
            },
            '/setsession': (req, res, next) => {
                req.session.favColor = "Red";
                res.send("colore set")
            }
        },
        'post': {

        },
        'NA': (req, res ,next) => { //'NA' :is a top livell key , like post or get
            res.status(404).sendFile(process.cwd()+'/views/404.htm');
            //process.cwd() to get the path , cwd :current working directory
        }
    }
    //Iterate throgh the routes object and routes
    // let resgisterRoutes = (routes, method) => {
    //     for(let key in routes) {
    //         if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)){
    //             resgisterRoutes(routes[key], key);
    //         } else {
    //             //Register the routes
    //             if(method === 'get'){
    //                 router.get(key, routes[key]);
    //             }else if(method === 'post') {
    //                 router.post(key, routes[key]);
    //             }
    //         }
    //     }
    // }
    // resgisterRoutes(routes);

    // return router;
    

    return h.route(routes);
}
