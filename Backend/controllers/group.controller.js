const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/uploadOnCloudinary");
const Invitation = require("../models/invitation.model");
const GroupMembership = require('../models/groupMembership.model')

async function createGroup(req, res) {
    try {
        const { groupName, isMembersCanInvite = false, groupAvatar } = req.body;
        const userId = req.userId;

        if (!groupAvatar) {
            groupAvatar = await uploadOnCloudinary(req.file);
        }

        const newGroup = await Chat.create({
            groupName,
            groupAvatar,
            groupAdmin: userId,
            isMembersCanInvite,
            isGroupChat: true,
            members: [userId]
        })
        await User.findByIdAndUpdate(userId, { $addToSet: { groups: newGroup._id } })

        if (!newGroup) {
            return res.status(400).json({ message: "Failed to Create a Group" })
        }

        await GroupMembership.create({
            userId,
            groupId: newGroup._id,
            joinedAt: new Date()
        });

        res.status(200).json({ message: "Group Created Sucssfully", createdGroup: newGroup })

    } catch (error) {
        console.log('Error in createGroup Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function getUserGroups(req, res) {
    try {
        const userId = req.userId;
        const usergroups = await User.findById(userId)
            .populate({
                path: "groups",
                select: "-__v -updatedAt",
                populate: {
                    path: "members",
                    select: "fullName _id avatar publicKey"
                }
            })
            .select("groups").lean()

        res.status(200).json(usergroups)
    } catch (error) {
        console.log('Error in getUserGroups Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function invitetoGroup(req, res) {
    try {
        let { userId, groupId } = req.body;

        if (!userId || !groupId) {
            return res.status(400).json({ message: "userId and groupId both required" })
        }

        const [user, group] = await Promise.all([
            User.findById(userId).lean(),
            Chat.findById(groupId).lean()
        ])

        if (!group) {
            return res.status(400).json({ message: "Error: Group not found" })
        }

        if (!user) {
            return res.status(400).json({ message: "Error: user not found" })
        }


        if (!group?.isMembersCanInvite && group?.groupAdmin?.toString() !== req.userId) {
            return res.status(400).json({ message: "Only Admin Can invite" })
        }

        const [isAlreadyaMember, alreadyInvitaionSent] = await Promise.all([
            Chat.findOne({
                _id: groupId, members: {
                    $in: [userId]
                }
            }).select('_id').lean(),
            Invitation.findOne({ to: userId, isForGroup: true, group: groupId }).select('_id').lean()
        ])

        if (isAlreadyaMember) {
            return res.status(200).json({ message: "Already a member" })
        }

        if (alreadyInvitaionSent) {
            return res.status(200).json({ message: "Already Invitaion sent by a Member" })
        }

        const invitation = await Invitation.create({
            from: req.userId,
            to: userId,
            isForGroup: true,
            group: groupId
        })

        if (!invitation) {
            return res.status(400).json({ message: "Failed to send group invitation. Please try again" })
        }

        res.status(200).json({ message: "Invitaion Send Sucessfully" })
    } catch (error) {
        console.log('Error in invitetoGroup Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function acceptGroupInvitation(req, res) {
    try {
        const { invitationId } = req.params;

        const [user, invitation] = await Promise.all([
            User.findById(req.userId).select('_id'),
            Invitation.findById(invitationId).lean()
        ])

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!invitation) {
            return res.status(400).json({ message: "Group Invitation not found" });
        }

        const [userUpdate, groupUpdate] = await Promise.all([
            User.updateOne(
                { _id: req.userId },
                { $addToSet: { groups: invitation.group } }),
            Chat.updateOne(
                { _id: invitation?.group },
                { $addToSet: { members: invitation.to } }
            )
        ])

        if (!groupUpdate.matchedCount === 0) {
            return res.status(404).json({ message: "Failed to Accept Group Invitaion." });
        }

        await Invitation.deleteOne({ _id: invitationId });

        await GroupMembership.create({
            userId: req.userId,
            groupId: invitation?.group,
            joinedAt: new Date()
        });
        res.status(200).json({ message: "Group Invitation Accepted" });

    } catch (error) {
        console.log('Error in acceptGroupInvitation Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function leaveGroup(req, res) {
    try {
        const { groupId } = req.params;
        const userId = req.userId;


        const [user, group] = await Promise.all([
            User.findByIdAndUpdate(userId, { $pull: { groups: groupId } }),
            Chat.findByIdAndUpdate(groupId, { $pull: { members: userId } })
        ])
        console.log(user)
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!group) return res.status(404).json({ message: "Group not found" });

        res.status(200).json({ message: "User leaved group successfully" });
    } catch (error) {
        console.log('Error in leaveGroup Handeler ', error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

module.exports = { createGroup, getUserGroups, invitetoGroup, acceptGroupInvitation, leaveGroup }