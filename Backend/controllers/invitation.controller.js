const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Invitation = require("../models/invitation.model")

async function sendFriendRequest(req, res) {
    try {
        const { toUserId } = req.body;
        const fromUserId = req.userId

        const user = await User.findById(toUserId).select("friends").lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.friends.includes(fromUserId)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        if (fromUserId === toUserId) {
            return res.status(400).json({ message: "You can't send yourself Friend Request" });
        }

        const existingRequest = await Invitation.findOne({
            from: fromUserId,
            to: toUserId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        await Invitation.create({
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

        const invitation = await Invitation.findByIdAndDelete(requestId)

        if (!invitation) return res.status(404).json({ message: "Friend Request Not Found." })

        await User.findByIdAndUpdate(invitation.from, {
            $addToSet: { friends: invitation.to }
        })

        await User.findByIdAndUpdate(invitation.to, {
            $addToSet: { friends: invitation.from }
        })

        await Chat.create({
            members: [invitation.to, invitation.from]
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
        await Invitation.findByIdAndDelete(requestId)
        res.status(200).json({ message: "Invitation Request Decliend" })
    } catch (error) {
        console.log('Error in declineFriendRequest Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function incommingRequests(req, res) {
    try {
        const userId = req.userId;
        const invitation = await Invitation.find({ to: userId }).populate('from', 'avatar fullName username').populate({
                path: 'group',
                select: 'groupName groupAvatar',
                match: { } // This ensures population only if `group` exists
            });
        if(invitation?.isForGroup){
            await invitation.populate('group')
        }
        if (invitation.length === 0) return res.status(200).json({ message: "No Incomming Request" })
        res.status(200).json(invitation)
    } catch (error) {
        console.log('Error in incommingRequests Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function outgoingRequests(req, res) {
    try {
        const userId = req.userId;
        const invitation = await Invitation.find({ from: userId }).populate('to', 'avatar fullName username').lean()
        if (invitation.length === 0) return res.status(200).json({ message: "No Outgoing Friend Request" })
        res.status(200).json(invitation)
    } catch (error) {
        console.log('Error in outgoingRequests Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

module.exports = { sendFriendRequest, acceptFriendRequest, declineFriendRequest, incommingRequests, outgoingRequests }