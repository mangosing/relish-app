require("dotenv").load();
const { Admin, Referrer, Invitee } = require("../models");
const passport = require("passport");
const flash = require("connect-flash");
const {
  getUserDetail,
  sendEmail,
  makeEmailParam,
  makeEmailObject,
  fullUrl
} = require("../helpers");
const crypto = require("crypto");

function loginFormHandler(req, res, next) {
  return res.render("admin/login");
}

async function showDashboardHandler(req, res, next) {
  try {
    const user = await getUserDetail();
    const referrers = await Referrer.find();
    const numAdmins = await Admin.count();
    let totalPurchases = referrers.length - numAdmins;
    if(totalPurchases <= 0 ){
      totalPurchases = 0;
    };
    const totalAmbassadors = referrers.reduce((prev, curr) => {
      return curr.isAmbassador ? prev + 1 : prev;
    }, 0);
    const totalInvitees = await Invitee.count();
    return res.render("admin/dashboard", {
      totalPurchases,
      totalAmbassadors,
      totalInvitees
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Not used atm
 * misspelled function - loginHander
 * don't know status
 */
function createAdminHandler(req, res, next) {
  const newAdmin = new Admin(req.body);
  return newAdmin
    .save()
    .then(admin => {
      req.loginHander(admin, function(err) {
        return res.redirect("/admin");
      });
    })
    .catch(err => {
      return next(err);
    });
}

const logInHandler = passport.authenticate("local", {
  successRedirect: "/admin",
  failureRedirect: "/admin/login"
});

function logoutHandler(req, res, next) {
  req.logout();
  req.session = null;
  return res.redirect("/");
}

function forgotPasswordHandler(req, res, next) {
  return res.render("admin/forgot");
}

function sendResetToken(req, res, next) {
  const BASE_URL = fullUrl(req);
  Admin.findOne({ email: req.body.email })
    .then(function(admin) {
      if (!admin) {
        req.flash("message", "Email does not exists");
        return res.redirect("/admin/forgot-password");
      } else {
        crypto.randomBytes(32, (err, buf) => {
          if (err) return next(err);
          Admin.findByIdAndUpdate(admin.id, {
            passwordResetToken: buf.toString("hex")
          }).then(function(admin) {
            const emailObj = [makeEmailObject(admin.email)];
            const tokenURL = `<a href=${BASE_URL}/admin/reset-password/${buf.toString(
              "hex"
            )}>Reset Password</a>`;
            const emailParam = makeEmailParam(emailObj, tokenURL);
            sendEmail(emailParam).then(function() {
              req.flash(
                "message",
                "Reset instructions have been sent to your email."
              );
              return res.redirect("/admin/login");
            });
          });
        });
      }
    })
    .catch(function(err) {
      return next(err);
    });
}

function checkAdminToken(req, res, next) {
  const linkToken = req.params.token;
  Admin.findOne({ passwordResetToken: linkToken })
    .then(function(admin) {
      if (!admin) {
        req.flash("message", "Invalid link");
        return res.redirect("/admin/forgot-password");
      } else {
        return res.render("admin/confirmEmail", { token: linkToken });
      }
    })
    .catch(function(err) {
      return next(err);
    });
}

function confirmEmailHandler(req, res, next) {
  const linkToken = req.params.token;
  const emailParam = req.body.email;
  Admin.findOne({ email: emailParam })
    .then(function(admin) {
      if (!admin) {
        req.flash("message", "Invalid Email");
        return res.redirect(`/admin/reset-password/${linkToken}`);
      } else {
        if (linkToken === admin.passwordResetToken) {
          return res.render("admin/newPasswordForm", {
            token: req.params.token
          });
        } else {
          req.flash("message", "Invalid");
          return res.redirect("/admin/forgot-password");
        }
      }
    })
    .catch(function(err) {
      return next(err);
    });
}

function updatePassword(req, res, next) {
  Admin.findOne({ passwordResetToken: req.params.token })
    .then(function(admin) {
      admin.password = req.body.password;
      delete admin.passwordResetToken;
      admin.save().then(function(admin) {
        req.flash("message", "Now login with your new password!");
        return res.redirect("/admin/login");
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

async function adminReferrerHandler(req, res, next) {
  const allReferrers = await Referrer.find();
  return res.render("admin/referrers", {
    allReferrers
  });
}

async function adminInviteesHandler(req, res, next) {
  const allInvitees = await Invitee.find()
    .populate("latestReferrer")
    .exec();
  return res.render("admin/invitees", {
    allInvitees
  });
}

module.exports = {
  loginFormHandler,
  showDashboardHandler,
  logInHandler,
  logoutHandler,
  forgotPasswordHandler,
  checkAdminToken,
  confirmEmailHandler,
  sendResetToken,
  updatePassword,
  adminReferrerHandler,
  adminInviteesHandler
};
