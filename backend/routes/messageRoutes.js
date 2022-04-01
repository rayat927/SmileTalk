const router = require('express').Router()
const Message = require('../models/message.model')

router.post('/message', (req, res) => {
    Message.create(req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.json(err)
    })
})



router.get('/message/:messageId', (req, res) => {
    Message.find({
        messageId: req.params.messageId
    }).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.json(err)
    })
})


module.exports = router