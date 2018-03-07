const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_STRIPE_SECRET_KEY
    : process.env.TEST_STRIPE_SECRET_KEY,
);
const VError = require('verror');
const debug = require('debug')('icarus-payment');
const { User, Payment } = require('../models');

async function chargeCreditCard(req, res, next) {
  const { amount, description } = req.body;
  const { stripeID } = req.user;
  debug(`Charging Customer: ${stripeID} - ${amount} - ${description}`);
  await stripe.charges
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

      payment
        .save()
        .then(doc => {
          debug(`Payment saved: ${doc.customer}`);
        })
        .catch(e => {
          throw new VError(e, 'Error saving payment information');
        });
      return next();
    })
    .catch(e => {
      debug(`Charge failed: ${stripeID} - ${e.type}`);
      return res.render('message', {
        title: 'Transaction Failed',
        message:
          'There was a problem processing your transaction. Please contact support for more information.',
      });
    });
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
