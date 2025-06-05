const mongoose = require('mongoose')

const invitationSchema = mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isForGroup: { type: Boolean, default: false },     // For Groups only
    group: { type: mongoose.Types.ObjectId, ref: 'Chat' }, // For Groups only
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
}, { timestamps: true });

const Invitation = mongoose.model("Invitation", invitationSchema)

module.exports = Invitation