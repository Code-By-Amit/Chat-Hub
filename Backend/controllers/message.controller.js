const Chat = require("../models/chat.model");
const Message = require('../models/message.model')
const { io, getReciverSocketId } = require("../Socket");
const { uploadOnCloudinary } = require("../utils/uploadOnCloudinary");

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
                members: { $all: [reciverId, userId] }
            })
        }

        let image;
        if (req.file) {
            const response = await uploadOnCloudinary(req.file.path);
            image = response.secure_url
        }

        const newMessage = await Message.create({
            chatId: chat._id,
            message,
            sender: userId,
            image
        })

        await newMessage.populate('sender');

        const memberSocketIds = await Promise.all(
            chat.members.map(member => getReciverSocketId(member)) // Then map and resolve promises
        );

        memberSocketIds.forEach(member => {
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
        const { chatId, toUserId } = req.params;
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
                members: { $all: [toUserId, fromUserId] }
            })
            if (!chat) {
                chat = await Chat.create({
                    isGroupChat: false,
                    members: [toUserId, fromUserId]
                })
            }
        }

        const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).populate('sender', 'avatar fullName username')
        res.status(200).json({ messages })
    } catch (error) {
        console.log('Error in getMessage Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


module.exports = { sendMessage, getMessage }
