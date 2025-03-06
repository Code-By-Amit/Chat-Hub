const User = require("../models/user.model");
const generateTokenAndSetCookie = require("../utils/generateCookieAndSetCookie");

async function signupUser(req, res) {
    try {
        const { firstName, lastName, username, password } = req.body;

        let user = await User.findOne({ username })
        if (user) {
            return res.status(200).json({ message: "username already exists" })
        }
        user = await User.create({
            firstName,
            lastName,
            username,
            password
        })

        const token = generateTokenAndSetCookie(user._id, res);

        const userWithoutPassword = user.toJSON()
        delete userWithoutPassword.password;

        res.status(201).json({ user: userWithoutPassword, token })
    } catch (error) {
        console.log('Error in Signup Handeler', error)
        res.status(500).json({ message: "Internal Server Error",error:error.message})
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

        const token = generateTokenAndSetCookie(user._id, res)

        const userWithoutPassword = user.toJSON()
        delete userWithoutPassword.password
        res.status(200).json({ user: userWithoutPassword, token })

    } catch (error) {
        console.log('Error in Login Handeler', error)
        res.status(500).json({ message: "Internal Server Error" ,error:error.message})
    }
}

module.exports = { signupUser, loginUser }