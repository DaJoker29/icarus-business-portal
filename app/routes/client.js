const express = require('express');
const ensureAuth = require('../../helpers/auth').ENSURE_AUTH;

const router = express.Router();

router.use('/', ensureAuth, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user });
});

module.exports = router;
