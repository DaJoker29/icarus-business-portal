const express = require('express');
const ensureAuth = require('../../helpers/auth').ENSURE_AUTH;
const unconfirmed = require('../../helpers/auth').UNCONFIRMED;
const authCtrl = require('../controllers/auth');

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
  res.render('dashboard', { title: 'Dashboard', user: req.user, name: 'index' });
});

module.exports = router;
