const { v4: uuidv4 } = require('uuid');
const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000",
    }
})


var clients = new Array()
var therapists = new Array()


io.on("connection", (socket) => {

    io.to(socket.id).emit("connected with server")

    function getTherapist() {
        var thera = therapists[Math.floor(Math.random() * therapists.length)]

        if(thera.user.busy) {
            getTherapist()
        } else {
            return thera
        }
    }

    socket.on("new user", (data) => {

        // Check if user's mail is in clients array
        if (!clients.some(client => client.user.id == data.user.id)) {
            clients.push(data)
            console.log(`New client ${data.user.email} (${data.socket}) connected`)
        }
    })

    socket.on("new therapist", (data) => {

        if (!therapists.some(client => client.user.id == data.user.id)) {
            therapists.push(data)
            console.log(`New therapist ${data.user.email} (${data.socket}) connected`)
        }
    })

    socket.on("find therapists", (data, cb) => {
        if(therapists.length != 0) {
            cb({
                completed: true,
                error: null,
                therapist: getTherapist()
            })
        } else {
            cb({
                completed: false,
                error: {
                    message: "No therapists available"
                }
            })
        }
    })

    socket.on("ask therapist", (data) => {
        console.log("Asking therapist")
        console.log(data)

        var ther = therapists.filter(ther => ther.socket == data.therapist.socket)
        var newTherapists = therapists

        io.to(data.therapist.socket).emit("client found", data)
    })

    socket.on("accept request", (data) => {
        io.to(data.clientSocket).emit("request accepted", data)
    })

    socket.on("reject request", (data) => {
        io.to(data.clientSocket).emit("request rejected")
    })

    socket.on("join room", (room) => {
        console.log(`${socket.id} joined room ${room}`)
        socket.join(room)
    })

    socket.on("leave room", (room, cb) => {
        socket.leave(room)
        cb()
    })

    socket.on("send therapist data", (data) => {
        io.to(data.to).emit("recive therapist data", (data.therapist))
    })

    socket.on("send client data", (data) => {
        io.to(data.to).emit("recive client data", (data.client))
    })

    socket.on("send message", (data, cb) => {
        io.to(data.room).emit("recive message", data.message)
        cb()
    })

    socket.on("send public message", (data, cb) => {
        console.log(data)
        cb(data.data)
        io.to(data.to).emit(data.event, data.data)
    })

    socket.on("disconnect", () => {
        newClients = clients.filter(client => client.socket != socket.id)
        clients = newClients

        var newTherapists = therapists.filter(client => client.socket != socket.id)
        therapists = newTherapists

        console.log(`Connection with client ${socket.id} closed`)
    })

})