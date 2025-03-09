const { signupUser, loginUser } = require('../controllers/auth.controller')
const { isAuthenticated } = require('../middlewares/auth')
const { validate } = require('../middlewares/validate')
const User = require('../models/user.model')
const { signupSchema, loginSchema } = require('../validatorsSchema/authSchema')

const router = require('express').Router()

router.post('/signup', validate(signupSchema), signupUser)
router.post('/login', validate(loginSchema), loginUser)
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        res.status(200).json({ message: "Auth User", user })

    } catch (error) {
        console.log('Error in fetching auth user Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})

module.exports = router