const User = require("../models/user.model");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/uploadOnCloudinary");

async function updateUser(req, res) {
    try {
        const { fullName, currentPassword, newPassword, bio } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId)

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(200).json({ message: "Please Provide Both Password" })
        }
        if (currentPassword && newPassword) {
            const isMatch =await user.comparePassword(currentPassword)
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
        user.profilePicture = imageUrl || user.profilePicture

        await user.save()

        const userWithoutPassword = user.toJSON()
        delete userWithoutPassword.password

        res.status(200).json({ message: "User Updated Sucessfully", user: userWithoutPassword })
    } catch (error) {
        console.log('Error in updateUser Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}




module.exports = { updateUser }