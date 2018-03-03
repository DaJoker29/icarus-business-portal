const router = require('express').Router();
const helpers = require('../../helpers');
const controllers = require('../controllers');

router.get(
  '/support',
  helpers.AUTH.AUTHENTICATED,
  controllers.SUPPORT.RENDER_SUPPORT,
);

router.post(
  '/support',
  helpers.AUTH.AUTHENTICATED,
  controllers.SUPPORT.SUBMIT_MESSAGE,
);

module.exports = router;
