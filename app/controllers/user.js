const VError = require('verror');
const debug = require('debug')('icarus-user');
const phoneNumber = require('libphonenumber-js');
const { Server, Resource, Payment, User } = require('../models');

function renderDash(req, res, next) {
  let serverlist;
  const { _id, stripeID } = req.user;

  Promise.all([
    Server.find({ assignedTo: _id }, null, { sort: { expires: 1 } }).populate(
      'domains',
    ),
    Resource.find({}, null, { sort: { createdAt: -1 } }),
    Payment.find({ customer: stripeID }, null, {
      sort: { created: -1 },
    }),
  ])
    .then(([servers, resources, payments]) => {
      serverlist = servers || [];
      if (servers) {
        serverlist = servers.map(server => {
          const { LABEL } = server;
          const resource = resources.find(
            e => e.hostname.toLowerCase() === LABEL.toLowerCase(),
          );

          return Object.assign(
            {},
            JSON.parse(JSON.stringify(server)),
            JSON.parse(JSON.stringify(resource || {})),
          );
        });
      }
      return res.render('dashboard', {
        title: 'Dashboard',
        user: req.user,
        servers: serverlist,
        payments,
      });
    })
    .catch(e => {
      next(new VError(e, 'Problem fetching data'));
    });
}

function renderAccount(req, res) {
  return res.render('account', { title: 'My Account', user: req.user });
}

function changeAccountInfo(req, res, next) {
  let update = req.body;
  const { phone } = req.body;
  const { id } = req.user;

  if (phone) {
    const parsed = phoneNumber.parse(phone, 'US');
    update = Object.assign({}, req.body, { phone: parsed });
  }

  User.findByIdAndUpdate(id, { $set: update }, { new: true })
    .then(user => {
      debug(`${user.email} account updated: ${JSON.stringify(update)}`);
      res.redirect('/account');
    })
    .catch(e => {
      next(new VError(e, 'Problem updating account info'));
    });
}

module.exports.RENDER_DASH = renderDash;
module.exports.RENDER_ACCOUNT = renderAccount;
module.exports.CHANGE_ACCOUNT_INFO = changeAccountInfo;
