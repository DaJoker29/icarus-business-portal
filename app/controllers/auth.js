const bcrypt = require('bcrypt');
const VError = require('verror');
const debug = require('debug')('icarus-auth');
const { User } = require('../models');
const { Confirm } = require('./index.js');

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(new VError(err, 'Problem generating password salt'));
    return bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(new VError(err, 'Problem generating password hash'));

      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

      return User.create(userData, (err, user) => {
        if (err) {
          if (err.message.startsWith('user validation failed')) {
            res.render('signup', {
              error: 'That email address is already in use',
            });
          }
          return next(new VError(err, 'Problem creating new User'));
        }
        debug(`New user created: ${user.email}`);
        Confirm.CONFIRM_USER(user.email);
        return res.redirect('/confirm', { email });
      });
    });
  });
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
