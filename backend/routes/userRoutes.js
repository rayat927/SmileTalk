const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const router = express.Router()
const {therapists} = require('../users')

router.post('/signup/:role', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(newPassword => {
        User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: newPassword,
            role: req.params.role == 'therapist' ? 'therapist' : 'user'
        }).then(() => {
            res.json({status: 'ok'})
        })
    }).catch(err => {
        console.log(err);
    })
})

router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email,
    }).then(user => {
        if (!user) {
            return { message: "user not found" }
        }

        bcrypt.compare(
            req.body.password,
            user.password
        ).then(isPasswordValid => {
            if(isPasswordValid) {
                const token = jwt.sign(
                    {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWTSECRET
                )
                return res.json({status: 'ok', user: token})
            }
            else{
                return res.json({status: 'error', user: false})
            }
        })
    })
})

router.get('/user/:email', (req, res) => {
    User.findOne({
        email: req.params.email
    }).then(user => {
        if(user){
            res.status(200).json(user)
        }
    }).catch(err => {
        res.json(err)
    })
})

router.get('/users', (req, res) => {
    User.find().then(users => {
        res.status(200).json(users)
    }).catch(err => {
        res.json(err)
    })
})

router.get('/userId/:userId', (req, res) => {
    User.findById(req.params.userId).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        res.json(err)
    })
})

router.get('/users/:therapistId', (req, res) => {
    User.findById(req.params.therapistId).then(user => {
        const therapist = therapists.find(therapist => therapist.userId === req.params.therapistId)
        res.status(200).json({_id: user._id, name: user.name, socketId: therapist.socketId})
    }).catch(err => {
        res.json(err)
    })
})

router.put('/user/message/:userId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId,{messages: req.body.messages}).then(user => {
        res.status(200).json(user)
    }).catch(err => res.json(err))
})

module.exports = router