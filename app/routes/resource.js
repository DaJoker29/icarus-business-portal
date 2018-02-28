const express = require('express');
const resourceCtrl = require('../controllers/resource');

const router = express.Router();

router.post('/resource', resourceCtrl.newResource);

module.exports = router;
