const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/uploadOnCloudinary");

async function updateUser(req, res) {
    try {
        const { fullName, username, currentPassword, newPassword, bio } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId)
        const isUsernameExists = await User.findOne({ username })
        if (isUsernameExists) {
            return res.status(400).json({ message: "Username Already Exists" })
        }

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ message: "Please Provide Both Password" })
        }
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword)
            if (!isMatch) return res.status(400).json({ message: "Invalid Password" })
            user.password = newPassword
        }

        let imageUrl
        if (req.file) {
            await deleteFromCloudinary(user.profilePicture)
            const response = await uploadOnCloudinary(req.file.path)
            imageUrl = response.secure_url
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        user.avatar = imageUrl || user.avatar

        await user.save()

        const userWithoutPassword = user.toJSON()
        delete userWithoutPassword.password

        res.status(200).json({ message: "User Updated Sucessfully", user: userWithoutPassword })
    } catch (error) {
        console.log('Error in updateUser Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function getUserFriends(req, res) {
    try {
        const userId = req.userId;
        const friends = await User.findById(userId).populate({ path: 'friends', select: "fullName avatar bio username publicKey" }).select('friends')
        res.status(200).json(friends)
    } catch (error) {
        console.log('Error in getUserFriends Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function searchUserByName(req, res) {
    try {
        const { search, limit=5 } = req.query;
        const users = await User.find({ fullName: RegExp(search, 'i') }).limit(Number(limit)).lean()
        res.status(200).json(users)
    } catch (error) {
        console.log('Error in searchUserByName Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function unfriendFriend(req,res){
    try {
        const {friendId} = req.params;
        const userId = req.userId;
        
        let conversationChat = await Chat.findOneAndDelete({members:{$in:[friendId,userId]}});
        if(!conversationChat){
            return res.status(400).json({message:"Chat Not Found"})
        }

        await Chat.deleteMany({chatId:conversationChat.chatId})
        
        res.status(200).json({message:"Unfriended successfully"})

    } catch (error) {
        console.log('Error in searchUserByName Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

module.exports = { updateUser, getUserFriends, searchUserByName ,unfriendFriend}