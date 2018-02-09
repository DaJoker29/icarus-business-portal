const express = require('express');
const userCtrl = require('../controllers').USER;
const ensureAuth = require('../../helpers').AUTH.ENSURE_AUTH;

const router = express.Router();

// Ensure only authenticated users access can access routes
router.use(ensureAuth);

// Fetch authenticated user data
router.get('/', userCtrl.FETCH_USER);

// Update Account Details
// router.post('/password', userCtrl.CHANGE_PASSWORD);
router.post('/info', userCtrl.CHANGE_INFO);

module.exports = router;
