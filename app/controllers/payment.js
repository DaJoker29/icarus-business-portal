const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_STRIPE_SECRET_KEY
    : process.env.TEST_STRIPE_SECRET_KEY,
);
const models = require('../models');
const VError = require('verror');

const User = models.USER;

function chargeCreditCard(id, amount, description) {
  console.log(id);
  console.log(amount);
  console.log(description);
  console.log('Charging...');
  stripe.charges.create(
    {
      amount,
      description,
      currency: 'usd',
      customer: id,
    },
    (err, charge) => {
      if (err) throw new VError(err, `Problem charging Stripe user: ${id}`);
      console.log(`Successful Charge: ${charge.id}`);
    },
  );
}

function createStripeID(req, res, next) {
  const { user } = req;
  const { stripeToken, serverID } = req.body;
  console.log(`Stripe Token: ${stripeToken}`);
  console.log(`Generating Stripe Customer token for ${user.email}.`);

  stripe.customers.create(
    {
      email: user.email,
      source: stripeToken,
    },
    (err, customer) => {
      if (err)
        next(new VError(err, `Problem creating Stripe ID: ${user.email}`));
      console.log(`Stripe Customer created: ${customer.id}`);
      User.findOneAndUpdate(
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
