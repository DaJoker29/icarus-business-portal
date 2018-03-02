const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');

router.get(
  '/renewal/:id',
  helpers.AUTH.AUTHENTICATED,
  controllers.RENEWAL.RENDER_RENEWAL,
);

router.post(
  '/renewal/:id',
  helpers.AUTH.AUTHENTICATED,
  controllers.RENEWAL.RENEW_PLAN,
);

module.exports = router;
