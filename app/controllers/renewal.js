const models = require('../models');
const paymentCtrl = require('./payment');
// TODO: Figure out why I can't call the controller module from here.

const Server = models.SERVER;

function renewPlan(req, res) {
  // TODO: Extend expiration date appropriate amount of time.
  paymentCtrl.CHARGE_CC(
    req.user.stripeID,
    req.body.amount,
    req.body.description,
  );
  return res.redirect('/');
}

function renderRenewal(req, res, next) {
  Server.findOne({ LINODEID: req.params.id }, (err, server) => {
    if (err) next(err);
    if (req.user._id == server.assignedTo) {
      if (req.user.stripeID) {
        return res.render('renewal', {
          title: 'Renew Server',
          server,
          user: req.user,
        });
      }
      return res.redirect(`/payment?server=${req.params.id}`);
    } else {
      console.log('Invalid credentials');
      return res.redirect('/');
    }
  });
}

module.exports.RENEW_PLAN = renewPlan;
module.exports.RENDER_RENEWAL = renderRenewal;
