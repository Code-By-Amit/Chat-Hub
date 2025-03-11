const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, incommingRequests, outgoingRequests } = require('../controllers/friendRequest.controller')
const { isAuthenticated } = require('../middlewares/auth')

const router = require('express').Router()

router.post('/send', isAuthenticated, sendFriendRequest)
router.post('/accept', isAuthenticated, acceptFriendRequest)
router.post('/decline', isAuthenticated, declineFriendRequest)
router.get('/incomming', isAuthenticated, incommingRequests)
router.get('/outgoing', isAuthenticated, outgoingRequests)

module.exports = router