const express = require("express");
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
require('dotenv').config()


const app = express();
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})
const mongoose = require('mongoose')

//database connection
mongoose.connect(process.env.MONGODB_CONNECT)
    .then((result) => console.log('connected to db'))
    .catch(e => console.log(e))

// socket.io connection
const { addTherapist, removeUser, getUser, therapists } = require('./users');

app.get("/", (req, res) => {
    res.json({message: "testing"})
})


io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on("addUser", (userId, role) => {
        addTherapist(userId,role, socket.id)
        io.emit("getUsers", therapists)
    })

    // socket.on('sendMessage', (message, callback) => {
    //     const user = getUser(socket.id)
    //     io.to(user.account).emit('message', {user: user.name, text: message})

    //     callback();
    // })

    socket.on('sendProblemMessage', ({message}) => {
        socket.emit('sendProblemMessage', {
            message
        })
    })

    socket.on('sendMessage', ({message, to}) => {
        socket.emit('sendMessage', {
            message,
            from: socket.id
        })
    })

    socket.on('disconnect', () => {
        // console.log('someone disconnected');
        // removeUser(socket.id);
        
    })
})

//routes
app.use(userRoutes)
app.use(messageRoutes)
app.use(chatbotRoutes)

app.get("/", (req, res) => res.sendFile("index.html"));

server.listen(8000, () => console.log("Listening on port 8000"));