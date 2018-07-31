const express = require('express');
const router = express.Router();
const { vhxPostHandler } = require('../handlers/api');
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json({ type: '*/*' });

router.route('/vimeo').post(jsonParser, vhxPostHandler);

module.exports = router;
