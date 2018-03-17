const VError = require('verror');
const debug = require('debug')('icarus-admin');
const { User, Server, Resource, Ticket, Payment } = require('../models');

function renderAdmin(req, res, next) {
  Promise.all([
    User.find(),
    Server.find({}, null, { sort: { expires: 1 } }),
    Resource.find({}, null, { sort: { createdAt: -1 } }),
    Ticket.find({}, null, { sort: { date: -1 } }),
    Payment.find({}, null, { sort: { created: -1 } }),
  ])
    .then(([users, servers, resources, messages, payments]) => {
      let serverlist = servers || [];
      if (servers && resources) {
        serverlist = servers.map(server => {
          const resource = resources.find(
            e => e.hostname.toLowerCase() === server.LABEL.toLowerCase(),
          );

          return Object.assign(
            {},
            JSON.parse(JSON.stringify(server)),
            JSON.parse(JSON.stringify(resource || {})),
          );
        });
      }
      res.render('admin', {
        title: 'Admin Panel',
        user: req.user,
        servers: serverlist,
        users,
        messages,
        payments,
      });
    })
    .catch(e => next(new VError(e, 'Problem rendering admin page')));
}

async function changeServerInfo(req, res, next) {
  if (req.body) {
    await Server.findOneAndUpdate(
      { LINODEID: req.params.id },
      { $set: req.body },
    )
      .then(server =>
        debug(`Server ${server.LINODEID} updated: ${JSON.stringify(req.body)}`),
      )
      .catch(e => next(new VError(e, 'Problem changing server information')));
  }
  res.redirect('/admin');
}

function renderUserDetail(req, res, next) {
  const { id } = req.params;
  return Promise.all([User.findById(id), Payment.find({ userId: id })])
    .then(([user, payments]) => {
      res.render('user', { user, payments });
    })
    .catch(e => next(new VError(e, 'Problem rendering user detail page')));
}

module.exports.RENDER_USER_DETAIL = renderUserDetail;
module.exports.RENDER_ADMIN = renderAdmin;
module.exports.CHANGE_SERVER_INFO = changeServerInfo;
