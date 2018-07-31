const express = require('express');
const router = express.Router();
const { homeHandler, indexPageHandler } = require('../handlers/home');
const { checkReferrerHandler } = require('../handlers/referrer');
const { alreadySignedUpOrLoggedIn } = require('../middleware/admin');

router
  .route('')
  //Already a subscriber? with refer friend button
  .get(alreadySignedUpOrLoggedIn, homeHandler)
  .post(alreadySignedUpOrLoggedIn, checkReferrerHandler);

//router.route('/home').get(indexPageHandler);

module.exports = router;
