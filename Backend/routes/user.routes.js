const router = require('express').Router()
const { updateUser,getUserFriends, searchUserByName, unfriendFriend } = require('../controllers/user.controller')
const {isAuthenticated} = require("../middlewares/auth")
const upload = require('../middlewares/multer')

router.use(isAuthenticated)

router.patch("/update",upload.single('avatar'),updateUser)
router.get("/friends",getUserFriends)
router.patch("/friends/unfriend/:friendId",unfriendFriend)

router.get("/",searchUserByName)


module.exports = router