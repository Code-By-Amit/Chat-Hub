const User = require("../models/user.model");
const generateTokenAndSetCookie = require("../utils/generateCookieAndSetCookie");

async function signupUser(req, res) {
    try {
        const { fullName, username, password } = req.body;

        let user = await User.findOne({ username })
        if (user) {
            return res.status(200).json({ message: "username already exists" })
        }
        user = await User.create({
            fullName,
            username,
            password
        })

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({ message: `Welcome, ${user.fullName}!` })
    } catch (error) {
        console.log('Error in Signup Handeler', error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid Credenitals" })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({ message: `Welcome back, ${user.fullName}!` })

    } catch (error) {
        console.log('Error in Login Handeler', error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

module.exports = { signupUser, loginUser }