const express = require('express');
const passport = require('passport');
const authCtrl = require('../controllers/auth');
const onlyUnauth = require('../../helpers/auth').ONLY_UNAUTHENTICATED;

const router = express.Router();

// Sign Up/Create Account
router.get('/signup', onlyUnauth, (req, res) => {
  res.render('signup', {
    title: 'Sign up below',
  });
});

router.post('/signup', authCtrl.CREATE_ACCT);

// Log In/Out
router.get('/login', onlyUnauth, (req, res) => {
  res.render('login', {
    title: 'Welcome',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
);

module.exports = router;
