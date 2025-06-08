const express = require('express')
const { app, server } = require('./Socket')
require('dotenv/config')
const cookieParser = require("cookie-parser")
const cors = require('cors')
const { connectToDB } = require('./connectToDB')

const authRoute = require('./routes/auth.routes')
const invitation = require('./routes/invitation.routes')
const messageRoute = require('./routes/message.routes')
const userRoute = require('./routes/user.routes')
const groupRoute = require('./routes/group.routes')
const { isAuthenticated } = require('./middlewares/auth')
const PushSubscription = require('./models/pushMessageSubscription.model')

const PORT = process.env.PORT || 4000

app.use(cors({
    origin: ["https://amit-chathub.netlify.app",'http://localhost:5173', 'http://localhost:3000', "http://192.168.181.232:5173"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/invitation', invitation)
app.use('/message', messageRoute)
app.use('/group', groupRoute)


app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is Running" })
})

app.post('/api/subscribe', isAuthenticated, async (req, res) => {
    const subscription = req.body;
    const userId = req.userId;

    const existing = await PushSubscription.findOne({
        userId,
        endpoint: subscription.endpoint
    });

    if (!existing) {
        // Save new subscription for this device/browser
        const newSubscription = await PushSubscription.create({
            userId,
            endpoint: subscription.endpoint,
            keys: subscription.keys
        });
    }
    res.status(201).json({ message: 'Subscription received' });
});

server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err
    connectToDB()
    console.log(`Server Started on Port ${PORT}`)
})