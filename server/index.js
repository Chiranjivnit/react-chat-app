const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const { addUsers, removeUser, getUser, getUsersInRoom } = require('./user');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket)=>{

    socket.on('join', ({name, room}, callback)=>{  // getting data from clientside(userName and Room

        const { user, error } = addUsers({id:socket.id, name, room});  // this user and error comes from addUsers function in user.js file. also we r passing socket id, name, room also to that function
       
         if(error) return callback(error); // if same name, room, id then that user function retun error.
         socket.emit('message', { user:'admin', text:`Hello Mr. ${user.name}, Welcome to room ${user.room} `})
         
         socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined `})
         socket.join(user.room);   // if not same then it will join the new room
         io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})
         callback();
    })

    socket.on('sendMessage', (message, callback)=>{
       
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user:user.name, text:message})
        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})
        callback();
    });

    socket.on('disconnect', ()=>{
    
        const user = removeUser(socket.id)

        if(user){
          io.to(user.room).emit('message', {user:'admin',text:`${user.name} has left `})
        }
    })
})

app.use(router);

server.listen(PORT,()=>{
   
});


