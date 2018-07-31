require('dotenv').load();
var mandrill_api = process.env.MANDRILL_API_KEY;
var mandrill = require('mandrill-api/mandrill');
const { Referrer, Invitee } = require('../models');
var mandrill_client = new mandrill.Mandrill(mandrill_api);
var url = require('url');

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
}

// Turn the API call to a promise
function sendEmail(params) {
  return new Promise(function(resolve, reject) {
    mandrill_client.messages.send(
      { message: params },
      function(res) {
        return resolve(res);
      },
      function(err) {
        return reject(err);
      }
    );
  });
}

function getUserDetail() {
  return new Promise(function(resolve, reject) {
    mandrill_client.users.info(
      {},
      function(res) {
        return resolve(res);
      },
      function(err) {
        return reject(err);
      }
    );
  });
}

function makeEmailParam(emails, html = '/', mergeTagArray) {
  return {
    from_email: 'noreply@therelish.com',
    to: emails,
    subject: 'Sending a test email',
    merge_vars: mergeTagArray,
    html: html,
    autotext: true,
    track_clicks: true,
    track_opens: true,
    inline_css: true
  };
}

function makeEmailObject(email) {
  return {
    email,
    type: 'to'
  };
}

function makeMergeTagVariableObj(email) {
  return {
    rcpt: email,
    vars: [
      {
        name: 'name',
        content: email
      }
    ]
  };
}

function splitAndTrimEmails(emails) {
  var output = emails.split(',');
  return output.map(email => email.trim());
}

async function createInviteeAssociateWithReferrer(email, referrerEmail) {
  try {
    const referrer = await Referrer.findOne({ email: referrerEmail });
    let invitee = await Invitee.findOne({ email });
    if (!invitee) {
      invitee = new Invitee({ email });
    }
    if (invitee && !invitee.hasPurchased) {
      invitee.latestReferrer = referrer;
    }
    const updatedInvitee = await invitee.save();
    const updatedReferrer = await Referrer.update(
      { _id: referrer.id },
      { $addToSet: { invitees: updatedInvitee.id } }
    );

    return updatedReferrer;
  } catch (err) {
    next(err);
  }
}

// function createInviteeAssociateWithReferrer(email, referrerEmail){
//   return Invitee.findOne({email: email})
//     .then(invitee => {
//       if(!invitee){
//         const invitee = new Invitee({ email})
//         invitee.save().then(invitee => {
//           return Referrer.findOneAndUpdate(
//             {email: referrerEmail},
//             { $addToSet: { invitees: invitee }
//           })
//         })
//       } else {
//         return Referrer.findOneAndUpdate(
//             {email: referrerEmail},
//             {$addToSet: {invitees: invitee}}
//           )
//       }
//     })
// }

function validateEmails(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email === '' || regex.test(email);
}

module.exports = {
  sendEmail,
  getUserDetail,
  makeEmailParam,
  makeEmailObject,
  splitAndTrimEmails,
  fullUrl,
  validateEmails,
  makeMergeTagVariableObj,
  createInviteeAssociateWithReferrer
};
