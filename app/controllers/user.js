const VError = require('verror');
const debug = require('debug')('icarus-user');
const phoneNumber = require('libphonenumber-js');
const models = require('../models');

const Server = models.SERVER;
const Resource = models.RESOURCE;
const User = models.USER;

function renderDash(req, res, next) {
  let serverlist;

  Server.find(
    { assignedTo: req.user._id },
    null,
    { sort: { expires: 1 } },
    (err, servers) => {
      if (err) return next(new VError(err, 'Problem fetching servers'));
      return Resource.find(
        {},
        null,
        { sort: { createdAt: -1 } },
        (err2, resources) => {
          if (err2) next(new VError(err2, 'Problem fetching resource data'));
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
          });
        },
      );
    },
  );
}

function renderAccount(req, res) {
  return res.render('account', { title: 'My Account', user: req.user });
}

async function changeAccountInfo(req, res, next) {
  let update = req.body;
  const { phone } = req.body;
  const { id } = req.user;

  if (phone) {
    const parsed = phoneNumber.parse(phone, 'US');
    update = Object.assign({}, req.body, { phone: parsed });
  }

  await User.findByIdAndUpdate(id, { $set: update }, { new: true })
    .then(user => {
      debug(`${user.email} account updated: ${JSON.stringify(update)}`);
    })
    .catch(e => {
      return next(new VError(e, 'Problem updating account info'));
    });

  return res.redirect('/account');
}

module.exports.RENDER_DASH = renderDash;
module.exports.RENDER_ACCOUNT = renderAccount;
module.exports.CHANGE_ACCOUNT_INFO = changeAccountInfo;
