const router = require('express').Router()
const User = require('../models/user.model')

router.post('/findTherapist', (req, res) => {
    const availableTherapists = req.body.availableTherapists
    const therapist = availableTherapists[Math.floor(Math.random()*availableTherapists.length)]
    User.findById(therapist.userId).then(user => {
        res.status(200).json({
        therapist: {user, socketId: therapist.socketId}
    })
    })
    
})

module.exports = router