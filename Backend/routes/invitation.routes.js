const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, incommingRequests, outgoingRequests } = require('../controllers/invitation.controller')
const { isAuthenticated } = require('../middlewares/auth')

const router = require('express').Router()

router.use(isAuthenticated)

router.post('/send', sendFriendRequest)
router.post('/accept', acceptFriendRequest)
router.post('/decline', declineFriendRequest)
router.get('/incomming', incommingRequests)
router.get('/outgoing', outgoingRequests)

module.exports = router