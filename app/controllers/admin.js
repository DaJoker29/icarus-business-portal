const VError = require('verror');
const debug = require('debug')('icarus-admin');
const moment = require('moment');
const models = require('../models');

const User = models.USER;
const Server = models.SERVER;
const Resource = models.RESOURCE;

function renderAdmin(req, res, next) {
  let userlist, serverlist;

  User.find({}, (err, users) => {
    if (err) return next(new VError(err, 'Problem fetching users'));
    return Server.find({}, null, { sort: { expires: 1 } }, (err, servers) => {
      if (err) return next(new VError(err, 'Problem fetching servers'));
      serverlist = servers;
      return Resource.find(
        {},
        null,
        { sort: { createdAt: -1 } },
        (err, resources) => {
          if (err) next(new VError(err, 'Problem fetching server resources'));
          userlist = users || [];
          serverlist = servers || [];
          if (servers) {
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
          return res.render('admin', {
            title: 'Admin Panel',
            user: req.user,
            users: userlist,
            servers: serverlist,
          });
        },
      );
    });
  });
}

function linkServerToUser(req, res, next) {
  const { selectedUser, selectedServer } = req.body;

  return Server.update(
    { LINODEID: selectedServer },
    { $set: { assignedTo: selectedUser } },
    { upsert: true },
    (err, server) => {
      if (err) next(new VError(err, 'Problem linking server'));
      if (server) {
        debug(`Server ${selectedServer} linked to ${selectedUser}`);
      } else {
        debug('No server found');
      }
      return res.redirect('/admin');
    },
  );
}

function changeServerInfo(req, res, next) {
  // TODO: Route all server info changes through this function.
  if (req.body.expirationDate) {
    return Server.findOneAndUpdate(
      { LINODEID: req.params.id },
      { $set: { expires: req.body.expirationDate } },
      (err, server) => {
        if (err)
          return next(new VError(err, 'Problem changing expiration date'));
        debug(
          `Server ${server.LINODEID} expiration date set to ${moment(
            server.expires,
          ).format('MMM d, YYYY')}`,
        );
        return res.redirect('/admin');
      },
    );
  }
  return res.redirect('/admin');
}

module.exports.RENDER_ADMIN = renderAdmin;
module.exports.LINK_SERVER = linkServerToUser;
module.exports.CHANGE_SERVER_INFO = changeServerInfo;
