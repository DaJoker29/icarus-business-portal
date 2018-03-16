const router = require('express').Router();
const passport = require('passport');
const { Auth: AuthCtrl } = require('../controllers');
const { Auth: AuthHelper } = require('../../helpers');

router.get('/login', AuthHelper.UNAUTHENTICATED, AuthCtrl.RENDER_LOGIN);

router.get('/logout', AuthCtrl.LOGOUT);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
);

module.exports = router;
