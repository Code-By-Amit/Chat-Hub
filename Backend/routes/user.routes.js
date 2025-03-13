const router = require('express').Router()
const { updateUser,getUserFriends, searchUserByName } = require('../controllers/user.controller')
const {isAuthenticated} = require("../middlewares/auth")
const upload = require('../middlewares/multer')


router.patch("/update",isAuthenticated,upload.single('avatar'),updateUser)
router.get("/friends",isAuthenticated,getUserFriends)

router.get("/",isAuthenticated,searchUserByName)


module.exports = router