const express = require('express')
const { app, server } = require('./Socket')
require('dotenv/config')
const cookieParser = require("cookie-parser")
const cors = require('cors')
const { connectToDB } = require('./connectToDB')

const authRoute = require('./routes/auth.routes')
const friendRequestRoute = require('./routes/friendRequest.routes')
const messageRoute = require('./routes/message.routes')
const userRoute = require('./routes/user.routes')

const PORT = process.env.PORT || 4000

app.use(cors({
    origin: ['http://localhost:5173',"http://192.168.181.232:5173"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/friendrequest',friendRequestRoute)
app.use('/message',messageRoute)


app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is Running" })
})

server.listen(PORT,'0.0.0.0', (err) => {
    if (err) throw err
    connectToDB()
    console.log(`Server Started on Port ${PORT}`)
})