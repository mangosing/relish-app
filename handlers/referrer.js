const { Referrer, Invitee } = require('../models');
const {
  makeMergeTagVariableObj,
  createInviteeAssociateWithReferrer,
  validateEmails,
  sendEmail,
  makeEmailParam,
  makeEmailObject,
  splitAndTrimEmails
} = require('../helpers');
const BASE_URL = process.env.BASE_URL;

async function checkReferrerHandler(req, res, next) {
  try {
    const email = req.session.id || req.body.email;
    const referrer = await getReferrerByEmailAndPopulateInvitees(email);
    if (!req.body.email && !req.session.id) {
      req.flash('message', 'Enter your email first');
      return res.redirect('/');
    } else if (!referrer) {
      req.flash('message', 'Email not found.');
      return res.redirect('/');
    }
    const { id, invitees, isAmbassador } = referrer;
    req.session.id = email;
    const flashMessage = isAmbassador ? 'Welcome Ambassador!' : 'Welcome!';
    return res.render('referrer/sendInvites', {
      refEmail: email,
      refLink: `${BASE_URL}/referrer/${id}/checkout`,
      success: res.locals.success.length ? res.locals.success : flashMessage,
      invitees,
      id
    });
  } catch (err) {
    next(err);
  }
}

async function referralLinkHandler(req, res, next) {
  try {
    const id = req.params.id;
    const referrer = await getReferrerById(id);
    if (id && referrer) {
      return res.render('purchase', { referrerId: id });
    } else {
      req.flash('message', 'Invalid Link');
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
}

async function getReferrerById(id) {
  try {
    const referrer = await Referrer.findById(id);
    return referrer || false;
  } catch (err) {
    next(err);
  }
}

async function getReferrerByEmailAndPopulateInvitees(email) {
  try {
    const referrer = await Referrer.findOne({ email })
      .populate('invitees')
      .exec();
    return referrer || false;
  } catch (err) {
    next(err);
  }
}

async function getAllReferrers() {
  try {
    const referrers = await Referrer.find({});
    return referrers || false;
  } catch (err) {
    next(err);
  }
}

async function referralPostLinkHandler(req, res, next) {
  try {
    const referrer = await getReferrerById(req.body.referralId);
    let invitee = await Invitee.findOne({ email: req.body.email });
    if (!invitee) {
      invitee = new Invitee({ email: req.body.email });
    }
    if (referrer && invitee && !invitee.hasPurchased) {
      invitee.latestReferrer = referrer;
    }
    const savedInvitee = await invitee.save();
    if (referrer && savedInvitee) {
      const updatedReferrer = await Referrer.update(
        { _id: referrer.id },
        { $addToSet: { invitees: savedInvitee.id } }
      );
    }
    return res.redirect('http://therelish.vhx.tv/');
  } catch (err) {
    next(err);
  }
}

async function referralLinkHandlerRedirect(req, res, next) {
  try {
    const referrer = await Referrer.findById(req.params.id);
    let invitee = await Invitee.findOne({ email: req.params.email });
    if (!invitee) {
      invitee = new Invitee({ email: req.params.email });
    }
    if (invitee && !invitee.hasPurchased) {
      invitee.latestReferrer = referrer;
    }
    const savedInvitee = await invitee.save();
    const updatedReferrer = await Referrer.update(
      { _id: referrer.id },
      { $addToSet: { invitees: savedInvitee.id } }
    );
    return res.redirect('http://therelish.vhx.tv/');
  } catch (err) {
    next(err);
  }
}

async function referrerPostHandler(req, res, next) {
  try {
    let refEmail = req.body.refEmail;
    let refLink = req.body.refLink;
    let emails = splitAndTrimEmails(req.body.emails);
    let emailsArray = [];
    let valid = true;

    if (!req.body.emails) {
      req.flash('message', 'Must enter emails.');
      return res.redirect('/referrer');
    }

    for (let i = 0; i < emails.length; i++) {
      if (validateEmails(emails[i])) {
        emailsArray.push(makeEmailObject(emails[i]));
      } else {
        valid = false;
        break;
      }
    }

    if (!valid) {
      req.flash('message', 'Please enter valid comma separated emails.');
      return res.redirect('/referrer');
    }
    const emailsGroup = await emails.map(email =>
      createInviteeAssociateWithReferrer(email, refEmail)
    );
    const emailsPromise = await Promise.all(emailsGroup);
    const variableMergeTagObjArray = await emails.map(email =>
      makeMergeTagVariableObj(email)
    );

    refLink = `<a href="${refLink}/*|name|*">Click on this to sign up</a>`;

    const sendEmailAction = await sendEmail(
      makeEmailParam(emailsArray, refLink, variableMergeTagObjArray)
    );

    const referrer = await Referrer.findOne({ email: refEmail })
      .populate('invitees')
      .exec();

    const populatedReferrerInvitees = referrer.invitees;

    req.flash('success', 'Email(s) sent successfully!');
    return res.redirect('/referrer');
  } catch (err) {
    req.flash('message', 'Something went wrong! Email failed to send.');
    return res.redirect('/referrer?next=null');
  }
}

function referrerLogout(req, res, next) {
  req.session = null;
  return res.redirect('/');
}

module.exports = {
  checkReferrerHandler,
  referralLinkHandler,
  referrerPostHandler,
  referralPostLinkHandler,
  referralLinkHandlerRedirect,
  referrerLogout
};
