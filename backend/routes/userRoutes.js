const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const router = express.Router()

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(newPassword => {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
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
                        email: user.email
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

module.exports = router