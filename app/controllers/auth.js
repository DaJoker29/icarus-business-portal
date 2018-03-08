const bcrypt = require('bcrypt');
const VError = require('verror');
const debug = require('debug')('icarus-auth');
const { User } = require('../models');
const { Confirm } = require('./index.js');

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  const saltRounds = 10;

  bcrypt
    .hash(req.body.password, saltRounds)
    .then(hash => {
      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

      return User.create(userData);
    })
    .then(user => {
      debug(`New user created: ${user.email}`);
      Confirm.CONFIRM_USER(user.email);
      res.redirect('/confirm', { email });
    })
    .catch(e => next(new VError(e, 'Problem creating new user')));
}

function renderSignUp(req, res) {
  res.render('signup', {
    title: 'Sign up below',
  });
}

function renderLogin(req, res) {
  res.render('login', {
    title: 'Welcome',
  });
}

function logout(req, res) {
  req.logout();
  res.redirect('/login');
}

module.exports.CREATE_ACCOUNT = createAccount;
module.exports.RENDER_SIGNUP = renderSignUp;
module.exports.RENDER_LOGIN = renderLogin;
module.exports.LOGOUT = logout;
