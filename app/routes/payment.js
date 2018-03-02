const router = require('express').Router();
const helpers = require('../../helpers');
const controllers = require('../controllers');

router.get(
  '/payment',
  helpers.AUTH.ENSURE_AUTH,
  controllers.PAYMENT.RENDER_PAYMENT_FORM,
);

router.post(
  '/payment/customer',
  helpers.AUTH.ENSURE_AUTH,
  controllers.PAYMENT.CREATE_STRIPE_ID,
);

module.exports = router;
