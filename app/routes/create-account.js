const express = require('express');
const createAcctCtrl = require('../controllers').CREATE_ACCT;
const passport = require('passport');

const router = express.Router();

// Post Account Details for Confirmation
router.post('/create-account', createAcctCtrl.CREATE_ACCT, (req, res) => {
  res.redirect('/');
});

module.exports = router;
