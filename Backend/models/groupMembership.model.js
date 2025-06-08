// models/GroupMembership.js
const mongoose = require('mongoose');

const groupMembershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const GroupMembership = mongoose.model('GroupMembership', groupMembershipSchema);
module.exports = GroupMembership  
