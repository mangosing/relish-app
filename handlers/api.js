const { Referrer, Invitee } = require('../models');
const SALES_FOR_AMBASSADOR = 2;

async function vhxPostHandler(req, res, next) {
  try {
    const invitee = await Invitee.findOne({ email: req.body.email }).populate(
      'Referrer'
    );
    invitee.hasPurchased = true;
    const referrer = await Referrer.findById(invitee.latestReferrer);
    referrer.purchaseCount++;
    if (
      referrer.purchaseCount >= SALES_FOR_AMBASSADOR &&
      !referrer.isAmbassador
    ) {
      referrer.isAmbassador = true;
    }
    const savedInvitee = await invitee.save();
    const savedReferrer = await referrer.save();
    const newReferrer = new Referrer({
      vimeoId: req.body.id,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state
    });
    const newSavedReferrer = await newReferrer.save();
    return res.status(201).json(newReferrer);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  vhxPostHandler
};
