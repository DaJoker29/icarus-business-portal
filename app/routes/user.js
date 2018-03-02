const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');

router.get(
  '/',
  helpers.AUTH.AUTHENTICATED,
  helpers.AUTH.UNVERIFIED,
  controllers.USER.RENDER_DASH,
);

router.get(
  '/account',
  helpers.AUTH.AUTHENTICATED,
  helpers.AUTH.UNVERIFIED,
  controllers.USER.RENDER_ACCOUNT,
);
router.post(
  '/account',
  helpers.AUTH.AUTHENTICATED,
  controllers.USER.CHANGE_ACCOUNT_INFO,
);

module.exports = router;
