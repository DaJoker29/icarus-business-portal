const VError = require('verror');
const bcrypt = require('bcrypt');
const debug = require('debug')('icarus-auth');
const { User, Confirm } = require('../models');
const plans = require('../../config/plans');
const confirmCtrl = require('./confirm');

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;

  const userData = {
    email,
    firstName,
    lastName,
    organization,
    phone,
  };

  return User.create(userData)
    .then(user => {
      debug(`New user created: ${user.email}`);
      confirmCtrl.CREATE_CONFIRM(user.email);
      res.redirect(`/confirm?email=${user.email}`);
    })
    .catch(e => next(new VError(e, 'Problem creating new user')));
}

function changePassword(req, res, next) {
  const { id } = req.user;
  const { currentPassword } = req.body;

  return User.findById(id, 'passwordHash')
    .then(({ passwordHash }) => bcrypt.compare(currentPassword, passwordHash))
    .then(result => {
      if (result) return res.redirect('/confirm/changePassword');
      throw new VError('Incorrect Password');
    })
    .catch(e => next(new VError(e, 'Problem creating new password')));
}

async function createPassword(req, res, next) {
  const { password } = req.body;
  const { token } = req.params;
  const saltRounds = 10;
  const emailPromise = req.user || Confirm.findOne({ token });

  return Promise.all([emailPromise, bcrypt.hash(password, saltRounds)])
    .then(([{ email }, hash]) => {
      debug(`Setting new password for ${email}`);
      return User.findOneAndUpdate(
        { email },
        { isVerified: true, passwordHash: hash },
        { new: true },
      );
    })
    .then(user => {
      debug(`New User Verified: ${user.email}`);
      debug(`New password created for user id: ${user.id}`);

      /**
       * Log out if currently logged in.
       */
      if (typeof req.logout === 'function') {
        req.logout();
      }

      return res.redirect('/');
    })
    .catch(e => next(new VError(e, 'Problem verifiying user record')));
}

function renderPassword(req, res) {
  const { token } = req.params;
  const { user } = req;

  res.render('password', {
    token,
    user,
  });
}

function renderSignUp(req, res) {
  res.render('signup', {
    title: 'Sign up below',
    plans,
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
module.exports.CREATE_PASSWORD = createPassword;
module.exports.CHANGE_PASSWORD = changePassword;
module.exports.RENDER_SIGNUP = renderSignUp;
module.exports.RENDER_LOGIN = renderLogin;
module.exports.RENDER_PASSWORD = renderPassword;
module.exports.LOGOUT = logout;
