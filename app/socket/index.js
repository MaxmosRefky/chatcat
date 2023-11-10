'use strict'

const { connection } = require('mongoose');
const h = require('../helpers');

module.exports = (io,app) => {
    let allrooms = app.locals.chatrooms;

    io.of('/roomslist').on('connection', socket => {
        socket.on('getChatrooms', () => {
            socket.emit('chatRoomsList', JSON.stringify(allrooms));
        });
        
        socket.on('createNewRoom', newRoomInput => {
            console.log(newRoomInput);
            if(!h.findRoomByName(allrooms, newRoomInput)){
                allrooms.push({
                    room: newRoomInput,
                    roomID: h.randomHex(),
                    users: []
                });
                // Emit an update list to the creator
                socket.emit('chatRoomsList', JSON.stringify(allrooms));
                //Emit an update list to everyone connected to rooms page
                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
            }
        });
        //console.log('Socket.io connected to client!');
    });

    io.of('/chatter').on('connection', socket => {
        //Join a chatroom
        socket.on('join', data => {
            let usersList = h.addUserToRoom(allrooms, data, socket);
           // let allusers = usersList.users;
            console.log('usersList : ' , usersList);
            console.log('usersList.room : ' , usersList.room);
            console.log('usersList.roomID : ' , usersList.roomID);
            console.log('usersList.users : ' , usersList.users);
            //update the list of active users as shown on the chatroom page
            socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
            socket.emit('updateUsersList', JSON.stringify(usersList.users));
            //console.log('userlist: ',userlist);
        });
    });

}