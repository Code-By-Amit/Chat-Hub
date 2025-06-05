const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchama = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    bio: {
        type: String,
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    publicKey: {
        type: String
    },
    encryptedPrivateKey: { type: String }
}, { timestamps: true })

userSchama.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword;
    next()
})

userSchama.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchama)
module.exports = User