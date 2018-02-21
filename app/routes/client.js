const express = require('express');
const ensureAuth = require('../../helpers/auth').ENSURE_AUTH;
const ensureAdmin = require('../../helpers/auth').ENSURE_ADMIN;
const unconfirmed = require('../../helpers/auth').UNCONFIRMED;
const authCtrl = require('../controllers/auth');
const User = require('../models/user');
const Server = require('../models/server');

const router = express.Router();

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

router.get('/confirm/resend', (req, res) => {
  res.render('resend');
});

router.post('/confirm/resend', authCtrl.RESEND_CONFIRM);

router.get('/confirm/token/:token', authCtrl.CONFIRM_TOKEN);

router.get('/', ensureAuth, unconfirmed, (req, res) => {
  Server.find({ LINODEID: { $in: req.user.servers } }, (err, servers) => {
    if (err) throw err;
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      servers,
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

// TODO: Separate ADMIN Routes/Controllers
router.get('/admin', ensureAuth, ensureAdmin, unconfirmed, (req, res) => {
  let userlist, serverlist;

  User.find({}, (err, docs) => {
    if (err) throw err;
    if (docs) {
      userlist = docs;
    } else {
      userlist = [];
    }
    Server.find({}, (err, docs) => {
      if (err) throw err;
      if (docs) {
        serverlist = docs;
      } else {
        serverlist = [];
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

module.exports = router;
