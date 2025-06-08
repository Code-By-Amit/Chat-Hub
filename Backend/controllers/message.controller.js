const Chat = require("../models/chat.model");
const GroupMembership = require("../models/groupMembership.model");
const Message = require('../models/message.model')
const { io, getReciverSocketId, isUserInChat } = require("../Socket");
const { sendWebPushNotification } = require("../utils/sendWebPushNotification");
const { uploadOnCloudinary } = require("../utils/uploadOnCloudinary");

async function sendMessage(req, res) {
    try {
        let { encryptedMessage, chatId, reciverId,createdAt,isForGroup, encryptedAESKeys } = req.body;
        const userId = req.userId;

        let chat
        if (chatId) {
            chat = await Chat.findById(chatId).select('members isGroupChat');
            if (!chat) {
                return res.status(404).json({ message: "Group Chat Not Found" })
            }
        } else {
            chat = await Chat.findOne({
                isGroupChat: false,
                members: { $all: [reciverId, userId], $size: 2 }
            }).select('members isGroupChat');
        }

        let image;
        if (req.file) {
            const response = await uploadOnCloudinary(req.file.path);
            image = response.secure_url
        }

        if (typeof encryptedAESKeys === "string") {
            encryptedAESKeys = JSON.parse(encryptedAESKeys);
        }

        const newMessage = await Message.create({
            chatId: chat._id,
            encryptedMessage,
            encryptedAESKeys,
            sender: userId,
            image,
            status: "sent",
            createdAt,
            isForGroup,
            readBy:[userId]
        })
        
        chat.lastMessage = newMessage._id;
        await chat.save();

        await newMessage.populate('sender', '_id avatar fullName');
        if (chatId) await newMessage.populate('chatId')

        for (const member of chat.members) {

            if (member.toString() == userId.toString()) continue;
            let isInChat = chat?.isGroupChat ? isUserInChat(userId, chat._id) : isUserInChat(userId, member)
            if (!isInChat) {
                await sendWebPushNotification(member, {
                    title: newMessage.sender.fullName,
                    body: newMessage.image ? 'Sent You a "Image"' : "Sent You a Message.",
                    icon: newMessage.sender.avatar,
                    data: { url: process.env.FrontEnd_Url, chatId: chat?._id.toString() }
                });
            }
        }
        const createdMsgId = newMessage._id
        const sentImage = newMessage?.image || null


        const memberSocketIds = await Promise.all(
            chat.members.filter(mId => mId != userId).map(member => getReciverSocketId(member)) // Then map and resolve promises
        );

        memberSocketIds.forEach(member => {
            io.to(member).emit("newMessage", newMessage.toJSON());
        });

        res.status(200).json({ message: "Message Sent", sentImage, createdMsgId })

    } catch (error) {
        console.log('Error in sendMessage Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function getMessage(req, res) {
    try {
        const { chatId, toUserId } = req.query;
        // const { page = 1, limit = 3 } = req.query;
        const fromUserId = req.userId;

        let chat
        if (chatId) {
            chat = await Chat.findById(chatId).lean()
            if (!chat) {
                return res.status(404).json({ message: "Group Chat Not Found" })
            }
        } else {
            chat = await Chat.findOne({
                isGroupChat: false,
                members: { $all: [toUserId, fromUserId] }
            }).lean()
            if (!chat) {
                chat = await Chat.create({
                    isGroupChat: false,
                    members: [toUserId, fromUserId]
                })
            }
        }
         let messageQuery = { chatId: chat._id };
        if(chatId){
            const membership = await GroupMembership.findOne({ userId:fromUserId, groupId:chatId }).select('joinedAt').lean();
            if (!membership) {
                return res.status(403).json({ message: 'You are not a group member' });
            }
            messageQuery.createdAt = { $gte: membership.joinedAt };
        }
            // const messages = await Message.find({ chatId: chat._id }).skip((page - 1) * Number(limit)).limit(Number(limit)).populate('sender', 'avatar fullName username')
        const messages = await Message.find(messageQuery).sort({ createdAt: 1 }).populate('sender', 'avatar fullName username').lean()

        res.status(200).json({ messages })
    } catch (error) {
        console.log('Error in getMessage Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


module.exports = { sendMessage, getMessage }