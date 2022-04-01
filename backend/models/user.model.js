const mongoose = require('mongoose')

const User = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    username: {type: String, required: true, unique:true},
    email: {type: String, required: true, unique: true},
    password: {type:String, required:true},
    role: {type:String, required: true},
    messages: {type: Array}
},

)

const model = mongoose.model('UserData', User)

module.exports = model 