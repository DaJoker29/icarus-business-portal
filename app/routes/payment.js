const router = require('express').Router();
const { Auth } = require('../../helpers');
const { Payment } = require('../controllers');

router.get('/payment', Auth.AUTHENTICATED, Payment.RENDER_PAYMENT_FORM);

router.post('/payment/customer', Auth.AUTHENTICATED, Payment.CREATE_STRIPE_ID);

router.get('/payments', Auth.AUTHENTICATED, Payment.RENDER_PAST_PAYMENTS);

module.exports = router;
