const router = require('express').Router();
const { User } = require('../controllers');
const { Auth } = require('../../helpers');

router.get('/', Auth.AUTHENTICATED, Auth.UNVERIFIED, User.RENDER_DASH);

router.get(
  '/account',
  Auth.AUTHENTICATED,
  Auth.UNVERIFIED,
  User.RENDER_ACCOUNT,
);
router.post('/account', Auth.AUTHENTICATED, User.CHANGE_ACCOUNT_INFO);

module.exports = router;
