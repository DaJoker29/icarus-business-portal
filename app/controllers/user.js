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
      if (err) next(err);
      Resource.find({}, null, { sort: { createdAt: -1 } }, (err, resources) => {
        if (err) next(err);
        serverlist = servers ? servers : [];
        if (servers) {
          serverlist = servers.map(server => {
            const { LABEL } = server;
            const resource = resources.find(e => {
              return e.hostname.toLowerCase() == LABEL.toLowerCase();
            });

            return Object.assign(
              {},
              JSON.parse(JSON.stringify(server)),
              JSON.parse(JSON.stringify(resource ? resource : {})),
            );
          });
        }
        res.render('dashboard', {
          title: 'Dashboard',
          user: req.user,
          servers: serverlist,
        });
      });
    },
  );
}

function renderAccount(req, res) {
  res.render('account', { title: 'My Account', user: req.user });
}

function changeAccountInfo(req, res) {
  User.update({ _id: req.user._id }, { $set: req.body }, err => {
    if (err) throw err;
    res.redirect('back');
  });
}

module.exports.RENDER_DASH = renderDash;
module.exports.RENDER_ACCOUNT = renderAccount;
module.exports.CHANGE_ACCOUNT_INFO = changeAccountInfo;
