const { signupUser, loginUser } = require('../controllers/auth.controller')
const { validate } = require('../middlewares/validate')
const { signupSchema, loginSchema } = require('../validatorsSchema/authSchema')

const router = require('express').Router()

router.post('/signup', validate(signupSchema), signupUser)
router.post('/login',validate(loginSchema),loginUser)

module.exports = router