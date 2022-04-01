require('dotenv').config()

let therapists = []

const addTherapist = (userId,role, socketId) => {
    !therapists.some((user) => user.userId === userId) &&
        role == 'therapist' &&
        therapists.push({userId,role,socketId})
}

const getUser = (id) => {
    
}

const removeUser = (id) => {
    therapists = therapists.filter(user => user.socketId !== id)
}

module.exports = { getUser, removeUser, addTherapist, therapists}