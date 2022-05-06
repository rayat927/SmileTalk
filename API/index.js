const uuid = require("uuid")
const express = require("express")
const crypt = require("bcrypt")
var bodyParser = require("body-parser");
const { connectToDB, getDB } = require("./db")
const app = express()
const jwt = require("jsonwebtoken")
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}));

let db;

connectToDB((err) => {
    if(!err) {
        app.listen(8000, () => {
            console.log("Server is running on port 8000")
        })
        db = getDB()
    } else {
        console.log("Errror connecting to DB")
        console.log(err)
    }
})



app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the server!"
    })
})

app.post("/user/new", (req, res) => {

    db.collection("Users").findOne({
        email: req.headers["email"]
    }).then(data => {
        if(data) {
            res.json({
                message: "User with that email already exists",
                completed: false,
                type: "error"
            })
        } else {
            crypt.hash(req.headers["password"], 10, (err, hash) => {
                if(err) {
                    res.json({
                        message: "Error hashing password",
                        completed: false,
                        type: "error"
                    })
                } else {
                    db.collection("Users").insertOne({
                        username: req.headers["username"],
                        email: req.headers["email"],
                        password: hash,
                        role: req.headers["role"],
                        id: uuid.v4()
                    }).then(data => {
                        const payload = {
                            "email": data.email,
                            "username": data.username,
                            "role": data.role,
                            "userId": data.id,
                            "mongoId": data._id
                        }

                        res.json({
                            message: "User added",
                            user: {
                                token: jwt.sign(payload, "HUDHEW908YFRW4HFIUDSWF87234TUERBVCW3846ORGTWEUHBF"),
                            },
                            completed: true,
                            type: "success"
                        })
                    }).catch(err => {
                        res.json({
                            message: "Error adding user",
                            error: err,
                            completed: false,
                            type: "error"
                        })
                    })
                }
            })
        }
    })
})

app.post("/user/old", (req, res) => {
    db.collection("Users").findOne({
        email: req.headers["email"]
    }).then(data => {
        if(data) {
            crypt.compare(req.headers["password"], data.password, (err, result) => {
                if(err) {
                    res.json({
                        message: "Could not log in",
                        completed: false,
                        type: "error"
                    })
                } else {
                    if(result) {
                        const payload = {
                            "email": data.email,
                            "username": data.username,
                            "role": data.role,
                            "userId": data.id,
                            "mongoId": data._id
                        }
                        res.json({
                            message: "Logged in",
                            user: {
                                token: jwt.sign(payload, "HUDHEW908YFRW4HFIUDSWF87234TUERBVCW3846ORGTWEUHBF")
                            },
                            completed: true,
                            type: "success"
                        })
                    } else {
                        res.json({
                            message: "Incorrect password",
                            completed: false,
                            type: "error"
                        })
                    }
                }
            })
        } else {
            res.json({
                message: "User with that email does not exist",
                completed: false,
                type: "error"
            })
        }
    })
})

app.post("/user/update/:id", (req, res) => {

    if(req.body) {
        db.collection("Users").updateOne({ id: req.params.id }, {
            $set: req.body
        }).then(data => {
            res.json({
                message: "User updated",
                user: data
            })
        }).catch(err => {
            res.json({
                message: "Error updating user",
                error: err
            })
        }) 
    } else {
        res.json({
            message: "No data given to update"
        })
    }

})

app.get("/user/:id", (req, res) => {
    db.collection("Users").findOne({ id: req.params.id })
    .then(data => {
        res.json({
            user: data
        })
    })
})

app.get("/chats/:id", (req, res) => {
    db.collection("Chats").findOne({ id: req.params.id })
    .then(data => {
        res.json({
            chat: data
        })
    })
})

app.get("/chats/:userId", (req, res) => {
    
})

