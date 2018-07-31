exports.ensureAdmin = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('message', 'Please log in first');
    return res.redirect('/admin/login');
  }
};

// if you're already logged in or signed up - you can't go back to the signup or login form
exports.alreadySignedUpOrLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('message', 'You are already logged in');
    return res.redirect('/admin');
  } else {
    return next();
  }
};
