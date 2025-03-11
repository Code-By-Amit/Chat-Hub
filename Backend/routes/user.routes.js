const router = require('express').Router()
const { updateUser,getUserFriends } = require('../controllers/user.controller')
const {isAuthenticated} = require("../middlewares/auth")
const upload = require('../middlewares/multer')


router.post("/update",isAuthenticated,upload.single('avatar'),updateUser)
router.get("/friends",isAuthenticated,getUserFriends)


module.exports = router