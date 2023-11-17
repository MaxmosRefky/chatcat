'use strict'

const { connection } = require('mongoose');
const h = require('../helpers');
const { json } = require('express');

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
            //update the list of active users as shown on the chatroom page
            socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
            socket.emit('updateUsersList', JSON.stringify(usersList.users));
            //console.log('userlist: ',userlist);
        });
        //When a socket exits
        socket.on('disconnect', () => {
            // Find the room, to which the socket is connected to and purge the user
            let room = h.removeUserFromRoom(allrooms, socket);
            socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
        });
        // when a new message arrives
        socket.on('newMessage', data => {
            socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
        });
    });

}