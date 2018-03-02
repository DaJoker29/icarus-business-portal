const router = require('express').Router();
const controllers = require('../controllers');
const helpers = require('../../helpers');
const passport = require('passport');

router.get(
  '/signup',
  helpers.AUTH.ONLY_UNAUTHENTICATED,
  controllers.AUTH.RENDER_SIGNUP,
);

router.post('/signup', controllers.AUTH.CREATE_ACCOUNT);

router.get(
  '/login',
  helpers.AUTH.ONLY_UNAUTHENTICATED,
  controllers.AUTH.RENDER_LOGIN,
);

router.get('/logout', controllers.AUTH.LOGOUT);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
);

module.exports = router;
