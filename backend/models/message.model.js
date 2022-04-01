const mongoose = require('mongoose')

const Message = new mongoose.Schema({
    senderId: {
        type: String
    },
    receiverId: {
        type: String,
    },
    text: {
        type: String
    }
},
{
    timestamps: true
}
)

const model = mongoose.model('MessageData', Message)

module.exports = model 