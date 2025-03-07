const router = require('express').Router()
const { updateUser } = require('../controllers/user.controller')
const {isAuthenticated} = require("../middlewares/auth")
const upload = require('../middlewares/multer')


router.post("/update",isAuthenticated,upload.single('profileImage'),updateUser)


module.exports = router