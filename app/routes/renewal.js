const router = require('express').Router();
const { Renewal, Payment } = require('../controllers');
const { Auth } = require('../../helpers');

router.get('/renewal/:id', Auth.AUTHENTICATED, Renewal.RENDER_RENEWAL);

router.post(
  '/renewal/:id',
  Auth.AUTHENTICATED,
  Payment.CHARGE_CC,
  Renewal.RENEW_PLAN,
);

module.exports = router;
