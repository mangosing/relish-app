const { Referrer } = require('../models');

function homeHandler(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  } else if (!req.isAuthenticated() && req.session.id) {
    return res.redirect('/referrer');
  }
  return res.render('pages/landing');
}

function indexPageHandler(req, res, next) {
  req.session.id = null;
  return res.render('pages/index');
}

// function homePostHandler(req, res, next) {
//   Referrer.findOne({ email: req.body.email })
//     .then(function(referrer) {
//       if (!referrer) {
//         req.flash('message', 'Email does not exists, join us now');
//         return res.redirect('/');
//       }
//       req.session.email = referrer.email;
//       return res.redirect('/referrer');
//     })
//     .catch(err => next(err));
// }

module.exports = {
  homeHandler,
  indexPageHandler
};
