const models = require('../models');

const User = models.USER;
const Server = models.SERVER;
const Resource = models.RESOURCE;

function renderAdmin(req, res, next) {
  let userlist, serverlist;

  User.find({}, (err, users) => {
    if (err) next(err);
    Server.find({}, null, { sort: { expires: 1 } }, (err, servers) => {
      if (err) next(err);
      serverlist = servers;
      Resource.find({}, null, { sort: { createdAt: -1 } }, (err, resources) => {
        if (err) next(err);
        userlist = users ? users : [];
        serverlist = servers ? servers : [];
        if (servers) {
          serverlist = servers.map(server => {
            const resource = resources.find(
              e => e.hostname.toLowerCase() === server.LABEL.toLowerCase(),
            );

            return Object.assign(
              {},
              JSON.parse(JSON.stringify(server)),
              JSON.parse(JSON.stringify(resource ? resource : {})),
            );
          });
        }
        res.render('admin', {
          title: 'Admin Panel',
          user: req.user,
          users: userlist,
          servers: serverlist,
        });
      });
    });
  });
}

function linkServerToUser(req, res) {
  const { selectedUser, selectedServer } = req.body;

  console.log('Searching for server: ' + selectedServer);
  Server.update(
    { LINODEID: selectedServer },
    { $set: { assignedTo: selectedUser } },
    { upsert: true },
    (err, server) => {
      if (err) throw err;
      if (server) {
        console.log('Server found and updated');
      } else {
        console.log('No server found');
      }
      return res.redirect('/admin');
    },
  );
}

function changeServerInfo(req, res, next) {
  // TODO: Route all server info changes through this function.
  if (req.body.expirationDate) {
    Server.findOneAndUpdate(
      { LINODEID: req.params.id },
      { $set: { expires: req.body.expirationDate } },
      err => {
        if (err) next(err);
        return res.redirect('/admin');
      },
    );
  } else {
    return res.redirect('/admin');
  }
}

module.exports.RENDER_ADMIN = renderAdmin;
module.exports.LINK_SERVER = linkServerToUser;
module.exports.CHANGE_SERVER_INFO = changeServerInfo;
