const express = require('express');
const createAcctCtrl = require('../controllers').CREATE_ACCT;

const router = express.Router();

// Post Account Details for Confirmation
router.post('/create-account', createAcctCtrl.CREATE_ACCT);

module.exports = router;