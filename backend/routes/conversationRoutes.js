const express = require('express')
const Conversation = require('../models/conversation.model')

const router = express.Router()

router.post('/converstation', (req,res) => {
    Conversation.create({
        members: [req.body.senderId, req.body.receiverId]
    }).then((data) => {
        res.status(200).json({data})
    }).catch(err => {
        res.json(err)
    })
})

router.get("/conversation/:userId", (req, res) => {
    Conversation.find({
        members: { $in: [req.params.userId]}
    }).then(conversation => {
        res.status(200).json(conversation)
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router