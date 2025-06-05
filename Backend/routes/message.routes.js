const { sendMessage ,getMessage} = require('../controllers/message.controller')
const { isAuthenticated } = require('../middlewares/auth')
const upload = require('../middlewares/multer')

const router = require('express').Router()

router.post('/send',isAuthenticated,upload.single('image'),sendMessage)
router.get('/getmessage',isAuthenticated,getMessage)

module.exports = router