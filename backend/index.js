const express = require("express");
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()


const app = express();
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = socketio(server)
const mongoose = require('mongoose')

//database connection
mongoose.connect(process.env.MONGODB_CONNECT)
    .then((result) => console.log('connected to db'))
    .catch(e => console.log(e))

// socket.io connection
const { removeUser, getUser } = require('./users');

app.get("/", (req, res) => {
    res.json({message: "testing"})
})


io.on('connect', (socket) => {
    console.log(socket.id);

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.account).emit('message', {user: user.name, text: message})

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        
    })
})

//routes
app.use(userRoutes)

app.get("/", (req, res) => res.sendFile("index.html"));

server.listen(8000, () => console.log("Listening on port 8000"));