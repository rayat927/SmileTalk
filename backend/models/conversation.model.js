const mongoose = require('mongoose')

const Conversation = new mongoose.Schema({
    members: {
        type: Array,
    },
    },
    {timestamps: true}

)

const model = mongoose.model('ConversationData', Conversation)

module.exports = model 