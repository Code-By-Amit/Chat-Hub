const Chat = require("../models/chat.model");
const Message = require('../models/message.model')
const { io, getReciverSocketId } = require("../Socket")

async function sendMessage(req, res) {
    try {
        const { message, chatId, reciverId } = req.body;
        const userId = req.userId;

        let chat
        if (chatId) {
            chat = await Chat.findById(chatId)
            if (!chat) {
                return res.status(404).json({ message: "Group Chat Not Found" })
            }
        } else {
            chat = await Chat.findOne({
                isGroupChat: false,
                members: { $in: [reciverId, userId] }
            })
        }
        const newMessage = await Message.create({
            chatId: chat._id,
            message,
            sender: userId
        })

        const memberSocketId = await Promise.all[
            chat.members.map((member) => getReciverSocketId(member))
        ]

        memberSocketId.forEach(member => {
            io.to(member).emit("newMessage", newMessage)
        });

        res.status(200).json({ message: "Message Sent" })

    } catch (error) {
        console.log('Error in sendMessage Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function getMessage(req, res) {
    try {
        const { chatId, toUserId } = req.body;
        const fromUserId = req.userId;

        let chat
        if (chatId) {
            chat = await Chat.findById(chatId)
            if (!chat) {
                return res.status(404).json({ message: "Group Chat Not Found" })
            }
        } else {
            chat = await Chat.findOne({
                isGroupChat: false,
                members: { $in: [toUserId, fromUserId] }
            })
        }

        const messages = await Message.find({ chatId: chat._id }).populate('sender', 'profilePicture fullName username')
        res.status(200).json({ messages })
    } catch (error) {
        console.log('Error in getMessage Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


module.exports = { sendMessage, getMessage }