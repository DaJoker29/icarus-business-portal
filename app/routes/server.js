const router = require('express').Router();
const { Auth } = require('../../helpers');
const { Server } = require('../controllers');

router.get(
  '/server/:id',
  Auth.AUTHENTICATED,
  Auth.UNVERIFIED,
  Server.RENDER_SERVER_DETAIL,
);

module.exports = router;
