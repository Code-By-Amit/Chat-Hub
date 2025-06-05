const { createGroup, getUserGroups ,invitetoGroup,acceptGroupInvitation,leaveGroup} = require('../controllers/group.controller')
const { isAuthenticated } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const router = require('express').Router()

router.use(isAuthenticated)
router.get('/', getUserGroups)
router.post('/create' ,upload.single('groupAvatar'),createGroup)
router.post('/invite',invitetoGroup)
router.post('/invitation/accept/:invitationId',acceptGroupInvitation)

router.patch('/leave/:groupId',leaveGroup)

module.exports = router