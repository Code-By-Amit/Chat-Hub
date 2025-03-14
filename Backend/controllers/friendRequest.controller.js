const Chat = require("../models/chat.model");
const FriendRequest = require("../models/friendRequest.model");
const User = require("../models/user.model");

async function sendFriendRequest(req, res) {
    try {
        const { toUserId } = req.body;
        const fromUserId = req.userId

        const user = await User.findById(toUserId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.friends.includes(fromUserId)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        if (fromUserId === toUserId) {
            return res.status(400).json({ message: "You can't send yourself Friend Request" });
        }

        const existingRequest = await FriendRequest.findOne({
            from: fromUserId,
            to: toUserId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        await FriendRequest.create({
            from: fromUserId,
            to: toUserId
        })

        res.status(200).json({ message: "Friend Request Sent Sucessfully" })
    } catch (error) {
        console.log('Error in sendFriendRequest Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function acceptFriendRequest(req, res) {
    try {
        const { requestId } = req.body;

        const friendRequest = await FriendRequest.findByIdAndDelete(requestId)

        if (!friendRequest) return res.status(404).json({ message: "Friend Request Not Found." })

        await User.findByIdAndUpdate(friendRequest.from, {
            $addToSet: { friends: friendRequest.to }
        })

        await User.findByIdAndUpdate(friendRequest.to, {
            $addToSet: { friends: friendRequest.from }
        })

        await Chat.create({
            members: [friendRequest.to, friendRequest.from]
        })

        res.status(200).json({ message: "Friend Request Accepted" })

    } catch (error) {
        console.log('Error in acceptFriendRequest Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
async function declineFriendRequest(req, res) {
    try {
        const { requestId } = req.body;
        await FriendRequest.findByIdAndDelete(requestId)
        res.status(200).json({ message: "Friend Request Decliend" })
    } catch (error) {
        console.log('Error in declineFriendRequest Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function incommingRequests(req, res) {
    try {
        const userId = req.userId;
        const friendRequest = await FriendRequest.find({ to: userId }).populate('from', 'avatar fullName username')
        if (friendRequest.length === 0) return res.status(200).json({ message: "No Incomming Friend Request" })
        res.status(200).json(friendRequest)
    } catch (error) {
        console.log('Error in incommingRequests Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function outgoingRequests(req, res) {
    try {
        const userId = req.userId;
        const friendRequest = await FriendRequest.find({ from: userId }).populate('to', 'avatar fullName username')
        if (friendRequest.length === 0) return res.status(200).json({ message: "No Outgoing Friend Request" })
        res.status(200).json(friendRequest)
    } catch (error) {
        console.log('Error in outgoingRequests Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

module.exports = { sendFriendRequest, acceptFriendRequest, declineFriendRequest, incommingRequests, outgoingRequests }