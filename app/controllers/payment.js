const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_STRIPE_SECRET_KEY
    : process.env.TEST_STRIPE_SECRET_KEY,
);
const VError = require('verror');
const debug = require('debug')('icarus-payment');
const models = require('../models');

const User = models.USER;

function chargeCreditCard(id, amount, description) {
  debug(`Charging Customer: ${id} - ${amount} - ${description}`);
  stripe.charges.create(
    {
      amount,
      description,
      currency: 'usd',
      customer: id,
    },
    (err, charge) => {
      if (err) throw new VError(err, `Problem charging Stripe user: ${id}`);
      debug(`Successful Charge: ${charge.id}`);
    },
  );
}

function createStripeID(req, res, next) {
  const { user } = req;
  const { stripeToken, serverID } = req.body;
  debug(`Stripe Token: ${stripeToken}`);
  debug(`Generating Stripe Customer token for ${user.email}.`);

  stripe.customers.create(
    {
      email: user.email,
      source: stripeToken,
    },
    (err, customer) => {
      if (err)
        return next(
          new VError(err, `Problem creating Stripe ID: ${user.email}`),
        );
      debug(`Stripe Customer created: ${customer.id}`);
      return User.findOneAndUpdate(
        { _id: user._id },
        { $set: { stripeID: customer.id } },
        { new: true },
        err => {
          if (err)
            return next(
              new VError(err, `Problem updating Stripe ID: ${user.id}`),
            );
          if (serverID) {
            return res.redirect(`/renewal/${serverID}`);
          }
          return res.redirect('/');
        },
      );
    },
  );
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
