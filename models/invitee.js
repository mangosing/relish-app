const mongoose = require('mongoose');
const shortid = require('shortid');
const inviteeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: shortid.generate
        },
        email: { type: String, required: true, unique: true },
        emailOpened: { type: Boolean, default: false },
        latestReferrer: {
            type: String,
            ref: 'Referrer'
        },
        hasPurchased: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Invitee = mongoose.model('Invitee', inviteeSchema);
module.exports = Invitee;
