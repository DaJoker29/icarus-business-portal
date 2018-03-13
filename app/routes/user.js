const router = require('express').Router();
const { Auth, User } = require('../controllers');
const { Auth: AuthHelpers } = require('../../helpers');

router.get(
  '/',
  AuthHelpers.AUTHENTICATED,
  AuthHelpers.UNVERIFIED,
  User.RENDER_DASH,
);

router.get(
  '/account',
  AuthHelpers.AUTHENTICATED,
  AuthHelpers.UNVERIFIED,
  User.RENDER_ACCOUNT,
);
router.post('/account', AuthHelpers.AUTHENTICATED, User.CHANGE_ACCOUNT_INFO);

router.post(
  '/account/password',
  AuthHelpers.AUTHENTICATED,
  Auth.CHANGE_PASSWORD,
);

router.get('/add', AuthHelpers.AUTHENTICATED, User.RENDER_ADD);

module.exports = router;
