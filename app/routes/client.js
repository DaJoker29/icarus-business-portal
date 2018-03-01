const express = require('express');
const ensureAuth = require('../../helpers/auth').ENSURE_AUTH;
const ensureAdmin = require('../../helpers/auth').ENSURE_ADMIN;
const unconfirmed = require('../../helpers/auth').UNCONFIRMED;
const authCtrl = require('../controllers/auth');
const paymentCtrl = require('../controllers/payment');
const User = require('../models/user');
const Server = require('../models/server');
const Resource = require('../models/resource');

const router = express.Router();

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

router.get('/confirm/resend', (req, res) => {
  res.render('resend');
});

router.post('/confirm/resend', authCtrl.RESEND_CONFIRM);

router.get('/confirm/token/:token', authCtrl.CONFIRM_TOKEN);

router.get('/', ensureAuth, unconfirmed, (req, res, next) => {
  let serverlist;

  Server.find({ assignedTo: req.user._id }, (err, servers) => {
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
  });
});

router.get('/account', ensureAuth, unconfirmed, (req, res) => {
  res.render('account', { title: 'My Account', user: req.user });
});

router.post('/account', ensureAuth, (req, res) => {
  User.update({ _id: req.user._id }, { $set: req.body }, err => {
    if (err) throw err;
    res.redirect('back');
  });
});

router.get('/renew/:id', ensureAuth, (req, res, next) => {
  Server.findOne({ LINODEID: req.params.id }, (err, server) => {
    if (err) next(err);
    if (req.user._id == server.assignedTo) {
      res.render('renew', { server, user: req.user });
    } else {
      console.log('Invalid credentials');
      res.redirect('/');
    }
  });
});

router.post('/renew/:id', ensureAuth, paymentCtrl.RENEW_PLAN);

// TODO: Separate ADMIN Routes/Controllers
router.get('/admin', ensureAuth, ensureAdmin, unconfirmed, (req, res, next) => {
  let userlist, serverlist;

  User.find({}, (err, users) => {
    if (err) next(err);
    Server.find({}, (err, servers) => {
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
});

router.post('/admin/link-server', ensureAuth, ensureAdmin, (req, res) => {
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
});

router.post('/admin/server/:id', ensureAuth, ensureAdmin, (req, res, next) => {
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
});

module.exports = router;
