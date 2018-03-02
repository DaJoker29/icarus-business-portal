const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');

router.get(
  '/admin',
  helpers.AUTH.ENSURE_AUTH,
  helpers.AUTH.ENSURE_ADMIN,
  helpers.AUTH.UNCONFIRMED,
  controllers.ADMIN.RENDER_ADMIN,
);

router.post(
  '/admin/link-server',
  helpers.AUTH.ENSURE_AUTH,
  helpers.AUTH.ENSURE_ADMIN,
  controllers.ADMIN.LINK_SERVER,
);

router.post(
  '/admin/server/:id',
  helpers.AUTH.ENSURE_AUTH,
  helpers.AUTH.ENSURE_ADMIN,
  controllers.ADMIN.CHANGE_SERVER_INFO,
);

module.exports = router;
