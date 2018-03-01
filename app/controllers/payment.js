const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_STRIPE_SECRET_KEY
    : process.env.TEST_STRIPE_SECRET_KEY,
);
const User = require('../models/user');

function charge(id, amount, description) {
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
      if (err) throw err;
    },
  );
}

function renewPlan(req, res, next) {
  if (req.user.stripeID) {
    // Charge Account and do renewal tasks
    charge(req.user.stripeID, req.body.amount, req.body.description);
    res.redirect('/');
  } else if (req.body.stripeToken) {
    // Create new stripe Customer and charge account
    console.log(req.body.stripeToken);
    const token = req.body.stripeToken;

    stripe.customers
      .create({
        email: req.user.email,
        source: token,
      })
      .then(customer => {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { stripeID: customer.id } },
          { new: true },
          (err, doc) => {
            if (err) next(err);
            if (doc) {
              console.log(doc);
              charge(doc.stripeID, req.body.amount, req.body.description);
              res.redirect('/');
            }
          },
        );
      });
  } else {
    // Redirect to capture card info from Stripe
    res.render('payment', {
      user: req.user,
      amount: req.body.amount,
      description: req.body.description,
    });
  }
}

module.exports.RENEW_PLAN = renewPlan;
