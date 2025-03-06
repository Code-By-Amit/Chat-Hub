const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    groupName: {
        type: String          // for Group Chats
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,    // for Group Chats
        ref: "User"
    },
    isGroupChat: {                              // For Group Chats
        type: Boolean,
        default: false
    },
    groupAvatar: {
        type: String,
        default: ""
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true })

chatSchema.index({ members: 1, isGroupChat: 1 })

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat