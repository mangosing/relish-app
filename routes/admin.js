const express = require('express');
const { Referrer, Invitee } = require('../models');

const router = express.Router({ mergeParams: true });
const {
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
  //    handleListReferrers
} = require('../handlers/admin');

const {
  ensureAdmin,
  alreadySignedUpOrLoggedIn
} = require('../middleware/admin');

router
  .route('')
  //HTTP action and function
  //protected routes
  .get(ensureAdmin, showDashboardHandler);

router
  .route('/login')
  .get(alreadySignedUpOrLoggedIn, loginFormHandler)
  .post(alreadySignedUpOrLoggedIn, logInHandler);

router.route('/logout').get(ensureAdmin, logoutHandler);

router
  .route('/forgot-password')
  .get(alreadySignedUpOrLoggedIn, forgotPasswordHandler)
  .post(alreadySignedUpOrLoggedIn, sendResetToken);

router
  .route('/reset-password/:token')
  .get(alreadySignedUpOrLoggedIn, checkAdminToken)
  .post(alreadySignedUpOrLoggedIn, confirmEmailHandler);

router
  .route('/:token/new-password')
  .get(alreadySignedUpOrLoggedIn, confirmEmailHandler)
  .post(alreadySignedUpOrLoggedIn, updatePassword);

//router.route('/admin/referrers').get(ensureAdmin, handleListReferrers);
router.route('/referrers').get(ensureAdmin, adminReferrerHandler);

router.route('/invitees').get(ensureAdmin, adminInviteesHandler);

router.route('/referrer/:id').get(ensureAdmin);
router.route('/invitees/:id').get(ensureAdmin);
module.exports = router;
