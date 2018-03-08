const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_STRIPE_SECRET_KEY
    : process.env.TEST_STRIPE_SECRET_KEY,
);
const VError = require('verror');
const debug = require('debug')('icarus-payment');
const { User, Payment } = require('../models');

function chargeCreditCard(req, res, next) {
  const { amount, description } = req.body;
  const { stripeID } = req.user;
  debug(`Charging Customer: ${stripeID} - ${amount} - ${description}`);
  stripe.charges
    .create({
      amount,
      description,
      currency: 'usd',
      customer: stripeID,
    })
    .then(({ id, created, amount, description, currency, customer }) => {
      debug(`Charge successful: ${id}`);
      const payment = new Payment({
        id,
        created,
        amount,
        description,
        currency,
        customer,
      });

      return payment.save();
    })
    .then(doc => {
      debug(`Payment saved: ${doc.customer}`);
      next();
    })
    .catch(e => {
      debug(`Error while charging Credit Card: ${stripeID} - ${e}`);
      return res.render('message', {
        title: 'Transaction Failed',
        message:
          'There was a problem processing your transaction. Please contact support for more information.',
      });
    });
}

function createStripeID(req, res, next) {
  const { user } = req;
  const { stripeToken } = req.body;
  debug(`Stripe Token: ${stripeToken}`);
  debug(`Generating Stripe Customer token for ${user.email}.`);

  stripe.customers
    .create({
      email: user.email,
      source: stripeToken,
    })
    .then(customer => {
      debug(`Stripe Customer created: ${customer.id}`);
      return User.findOneAndUpdate(
        { _id: user._id },
        { $set: { stripeID: customer.id } },
        { new: true },
      );
    })
    .then(() => {
      if (req.body.serverID) {
        return res.redirect(`/renewal/${req.body.serverID}`);
      }
      return res.redirect('/');
    })
    .catch(e => next(new VError(e, `Problem updating Stripe ID: ${user.id}`)));
}

function renderPaymentForm(req, res) {
  res.render('payment', {
    title: 'Enter Payment Card',
    serverID: req.query.server,
  });
}

module.exports.CHARGE_CC = chargeCreditCard;
module.exports.CREATE_STRIPE_ID = createStripeID;
module.exports.RENDER_PAYMENT_FORM = renderPaymentForm;
