const { Admin } = require('../models');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        Admin.findOne({ email }, function(err, admin) {
          if (err) {
            return done(err);
          }
          if (!admin) {
            return done(
              null,
              false,
              req.flash('message', 'Invalid credentials.')
            );
          }
          if (!admin.comparePassword(password)) {
            return done(
              null,
              false,
              req.flash('message', 'Invalid credentials.')
            );
          }
          req.session.id = admin.email;
          return done(null, admin);
        });
      }
    )
  );

  passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admin) {
      done(err, admin);
    });
  });
};
