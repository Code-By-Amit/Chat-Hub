const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    groupName: {
        type: String,          // for Group Chats
        maxlength: 100
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,    // For Group Chats
        ref: "User"
    },
    isGroupChat: {                              // For Group Chats
        type: Boolean,
        default: false
    },
    groupAvatar: {                              // For Group Chats
        type: String,
        default: ""
    },
    isMembersCanInvite: {                       // For Group Chats
        type: Boolean,
        default: false
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