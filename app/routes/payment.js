const router = require('express').Router();
const helpers = require('../../helpers');
const controllers = require('../controllers');

router.get(
  '/payment',
  helpers.AUTH.AUTHENTICATED,
  controllers.PAYMENT.RENDER_PAYMENT_FORM,
);

router.post(
  '/payment/customer',
  helpers.AUTH.AUTHENTICATED,
  controllers.PAYMENT.CREATE_STRIPE_ID,
);

module.exports = router;
