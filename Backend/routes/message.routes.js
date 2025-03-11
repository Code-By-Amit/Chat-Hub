const { sendMessage ,getMessage} = require('../controllers/message.controller')
const { isAuthenticated } = require('../middlewares/auth')

const router = require('express').Router()

router.post('/send',isAuthenticated,sendMessage)
router.get('/getmessage/:toUserId',isAuthenticated,getMessage)

module.exports = router