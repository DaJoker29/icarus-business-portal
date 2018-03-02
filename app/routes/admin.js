const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');

router.get(
  '/admin',
  helpers.AUTH.AUTHENTICATED,
  helpers.AUTH.ADMIN,
  helpers.AUTH.UNVERIFIED,
  controllers.ADMIN.RENDER_ADMIN,
);

router.post(
  '/admin/link-server',
  helpers.AUTH.AUTHENTICATED,
  helpers.AUTH.ADMIN,
  controllers.ADMIN.LINK_SERVER,
);

router.post(
  '/admin/server/:id',
  helpers.AUTH.AUTHENTICATED,
  helpers.AUTH.ADMIN,
  controllers.ADMIN.CHANGE_SERVER_INFO,
);

module.exports = router;
