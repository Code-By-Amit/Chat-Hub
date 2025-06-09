const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const Chat = require('../models/chat.model')
const Message = require('../models/message.model')

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://amit-chathub.netlify.app", 'http://localhost:5173', 'http://localhost:3000', "http://192.168.181.232:5173"],
        credentials: true,
    }
})

function getReciverSocketId(reciverId) {
    return userSocketMap[reciverId]
}

function isUserInChat(recipientId, chatId) {
    return activeChats.get(recipientId)?.toString() === chatId.toString();
}

let userSocketMap = {}
let activeChats = new Map();

io.on('connection', (socket) => {

    let userId = socket.handshake.auth.userId.toString();
    if (userId !== 'undefined') userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('typing', (data) => {
        io.to(userSocketMap[data.to]).emit('typing', data.from)
    })

    socket.on("stopTyping", (data) => {
        io.to(userSocketMap[data.to]).emit("stopTyping", data.from);
    });

    socket.on('activeChat', async ({ chatWith }) => {
        if (chatWith) {
            activeChats.set(userId.toString(), chatWith.toString()); // Mark user as active in this chat
        } else {
            activeChats.delete(userId);  // ❌ Chat closed
        }
    });

    socket.on('messageRead', async ({ chatId, isGroupChat, messageIds }) => {

        const messages = await Message.find({ _id: { $in: messageIds } });
        
        const updateOps = messages.map(async (msg) => {
            const alreadyRead = msg.readBy.includes(userId);
            if (!alreadyRead && msg.sender.toString() !== userId.toString()) {
                
                msg.readBy.push(userId);
                let chat
                if (isGroupChat) {
                    chat = await Chat.findById(chatId);
                } else {
                    chat = await Chat.findOne({
                        isGroupChat: false,
                        members: { $all: [userId, chatId], $size: 2 }
                    })
                }      
                console.log('chat',chat)
                console.log(msg?.readBy?.length)
                console.log(chat?.members?.length)
                
                if (msg?.readBy?.length === chat?.members?.length) {
                    msg.status = 'read';
                }

                await msg.save();

                // Inform sender in real-time
                const senderSocketId = userSocketMap[msg.sender.toString()];
                if (senderSocketId) {
                    io.to(senderSocketId).emit('message-read', { messageId: msg._id });
                }
            }
        });

        await Promise.all(updateOps);
    });

    socket.on('disconnect', (reason) => {
        delete userSocketMap[userId]
        activeChats.delete(userId);
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })

})

module.exports = { io, app, server, getReciverSocketId, isUserInChat }