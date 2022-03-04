const express = require("express");
const socketio = require('socket.io')
const http = require('http')


const app = express();
const server = http.createServer(app)
const io = socketio(server)

const { removeUser, getUser } = require('./users');

io.on('connect', (socket) => {
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.account).emit('message', {user: user.name, text: message})

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        
    })
})
// app.use(express.static("frontend/public"));


app.get("/", (req, res) => res.sendFile("index.html"));

server.listen(8080, () => console.log("Listening on port 8080"));