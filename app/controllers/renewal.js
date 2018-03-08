const VError = require('verror');
const debug = require('debug')('icarus-renewal');
const moment = require('moment');
const { Server } = require('../models');

// TODO: Figure out why I can't call the controller module from here.

async function renewPlan(req, res) {
  const { server, expires } = req.body;
  const update = {
    expires: moment(expires).add(1, 'y'),
  };

  debug(`Renewing server ${server} for 1 year`);
  await Server.findOneAndUpdate({ LINODEID: server }, update, { new: true })
    .then(doc => {
      debug(`Server renewed: ${server}`);
      return res.render('message', {
        title: 'Renewal Successful',
        message: `Your plan has been extended to ${moment(doc.expires).format(
          'MMM Do, YYYY',
        )}.`,
      });
    })
    .catch(e => {
      debug(`Server renewal failed: ${e}`);
      return res.render('message', {
        title: 'Renewal Unsuccessful',
        message: `We encountered a problem on our end while processing your renewal. We'll fix this shortly.`,
      });
    });
}

function renderRenewal(req, res, next) {
  Server.findOne({ LINODEID: req.params.id })
    .then(server => {
      if (req.user.email !== server.assignedTo) {
        throw new VError(
          "User trying to renew server that isn't assigned to them.",
        );
      }

      if (req.user.stripeID) {
        return res.render('renewal', {
          title: 'Renew Server',
          server,
          user: req.user,
        });
      }
      return res.redirect(`/payment?server=${req.params.id}`);
    })
    .catch(e => next(new VError(e, 'Problem rendering renewal page')));
}

module.exports.RENEW_PLAN = renewPlan;
module.exports.RENDER_RENEWAL = renderRenewal;
