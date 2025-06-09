const User = require("../models/user.model");
const generateTokenAndSetCookie = require("../utils/generateCookieAndSetCookie");

async function signupUser(req, res) {
    try {
        const { fullName, username, password ,gender, publicKey ,encryptedPrivateKey } = req.body;

        let user = await User.findOne({ username }).lean()
        if (user) {
            return res.status(200).json({ message: "username already exists" })
        }

        let avatar
        if(gender){
            let boyOrGirl = gender === 'male' ? 'boy' : 'girl'
            avatar = `https://avatar.iran.liara.run/public/${boyOrGirl}?username=${username}`
        }
        user = await User.create({
            fullName,
            username,
            password,
            avatar,
            publicKey,
            encryptedPrivateKey
        })

        const token = generateTokenAndSetCookie(user._id, res);

        res.status(201).json({ message: `Welcome, ${user.fullName}!`, token })
    } catch (error) {
        console.log('Error in Signup Handeler', error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('_id')
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid Credenitals" })
        }

        const token = generateTokenAndSetCookie(user._id, res)

        res.status(200).json({ message: `Welcome back, ${user.fullName}!`,encryptedPrivateKey: user.encryptedPrivateKey, token })

    } catch (error) {
        console.log('Error in Login Handeler', error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


async function logOutUser(req, res) {
    try {
        res.clearCookie('token')
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.log('Error in Login Handeler', error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


module.exports = { signupUser, loginUser, logOutUser }