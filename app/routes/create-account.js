const express = require('express');
const createAcctCtrl = require('../controllers').CREATE_ACCT;

const router = express.Router();

router.post('/create-account', createAcctCtrl.CREATE_ACCT, (req, res) => {
  // If successful, redirect to Home Page
  res.redirect('/');
});

module.exports = router;
