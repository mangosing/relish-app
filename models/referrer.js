const mongoose = require('mongoose');
const shortid = require('shortid');
const referrerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate
    },
    vimeoId: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    isAmbassador: { type: Boolean, default: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    invitees: [
      {
        type: String,
        ref: 'Invitee'
      }
    ],
    purchaseCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Referrer = mongoose.model('Referrer', referrerSchema);
module.exports = Referrer;
