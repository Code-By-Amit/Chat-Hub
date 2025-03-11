const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', "http://192.168.181.232:5173"],
        credentials: true,
    }
})

function getReciverSocketId(reciverId) {
    return userSocketMap[reciverId]
}

let userSocketMap = {}

io.on('connection', (socket) => {

    let userId = socket.handshake.query.userId
    if (userId !== 'undefined') userSocketMap[userId] = socket.id;
    console.log(userSocketMap)
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', (socket) => {
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })

})

module.exports = { io, app, server, getReciverSocketId }