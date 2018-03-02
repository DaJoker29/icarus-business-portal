const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');

router.get(
  '/',
  helpers.AUTH.ENSURE_AUTH,
  helpers.AUTH.UNCONFIRMED,
  controllers.USER.RENDER_DASH,
);

router.get(
  '/account',
  helpers.AUTH.ENSURE_AUTH,
  helpers.AUTH.UNCONFIRMED,
  controllers.USER.RENDER_ACCOUNT,
);
router.post(
  '/account',
  helpers.AUTH.ENSURE_AUTH,
  controllers.USER.CHANGE_ACCOUNT_INFO,
);

module.exports = router;
