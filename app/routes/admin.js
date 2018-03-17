const router = require('express').Router();
const { Admin } = require('../controllers');
const { Auth } = require('../../helpers');

router.get(
  '/admin',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Auth.UNVERIFIED,
  Admin.RENDER_ADMIN,
);

router.get(
  '/admin/user/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.RENDER_USER_DETAIL,
);

router.get(
  '/admin/server/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.RENDER_SERVER_DETAIL,
);

router.post(
  '/admin/comment/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.COMMENT_TICKET,
);

router.get(
  '/admin/ticket/close/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.CLOSE_TICKET,
);

router.get(
  '/admin/ticket/assign/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.ASSIGN_TICKET,
);

router.get(
  '/admin/ticket/complete/:id',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.COMPLETE_TICKET,
);

router.post(
  '/admin/server/domain',
  Auth.AUTHENTICATED,
  Auth.ADMIN,
  Admin.ADD_DOMAIN,
);

module.exports = router;
