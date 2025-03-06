const mongoose = require('mongoose')


const messageSchama = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: [500, "Message can't be more than 500 characters."],
    },
    image: {
        type: String,
    }
}, { timestamps: true })

messageSchama.index({ chatId: 1, sender: 1 })

const Message = mongoose.model("Message",messageSchama)

module.exports = Message