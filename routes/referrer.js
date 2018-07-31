const express = require('express');
const router = express.Router();
const {
  checkReferrerHandler,
  referralLinkHandler,
  referrerPostHandler,
  referralPostLinkHandler,
  referralLinkHandlerRedirect,
  referrerLogout
} = require('../handlers/referrer');

router
  .route('')
  //Already a subscriber? with refer friend button
  .get(checkReferrerHandler)
  .post(referrerPostHandler);

router
  .route('/:id/checkout')
  .get(referralLinkHandler)
  .post(referralPostLinkHandler);

router.route('/:id/checkout/:email').get(referralLinkHandlerRedirect);
router.route('/logout').get(referrerLogout);
module.exports = router;
