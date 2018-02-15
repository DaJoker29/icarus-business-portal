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
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user,
    name: 'index',
  });
});

// TODO: Separate ADMIN Routes/Controllers
router.get('/admin', ensureAuth, ensureAdmin, (req, res) => {
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
  Server.findOne({ LINODEID: selectedServer }, (err, server) => {
    if (err) throw err;
    if (server) {
      console.log('Server found');
      if (server.assigned === false) {
        console.log('Updating User Record');
        User.update(
          { _id: selectedUser },
          { $push: { servers: selectedServer } },
          err => {
            if (err) throw err;
            console.log('Updating Server Record');
            Server.update(
              { LINODEID: selectedServer },
              { $set: { assigned: true } },
              err => {
                if (err) throw err;
                console.log(
                  `Successfully linked ${selectedServer} to ${selectedUser}.`,
                );
                return res.redirect('/admin');
              },
            );
          },
        );
      } else {
        console.log('Server already assigned');
        return res.redirect('/admin');
      }
    } else {
      console.log('No server found');
      return res.redirect('/admin');
    }
  });
});

module.exports = router;
