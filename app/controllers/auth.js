const bcrypt = require('bcrypt');
const models = require('../models');
const controllers = require('./index.js');

const User = models.USER;

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  const saltRounds = 10;

  // Generate Salt/Hash
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(err);

      // Build new User object
      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

      // Submit new User object.
      User.create(userData, (err, user) => {
        if (err) {
          if (err.message.startsWith('user validation failed')) {
            res.render('signup', {
              error: 'That email address is already in use',
            });
          }
          return next(err);
        }
        controllers.CONFIRM.CONFIRM_USER(user.email);
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

// Log in handled by Passport.
function logout(req, res) {
  req.logout();
  res.redirect('/login');
}

module.exports.CREATE_ACCOUNT = createAccount;
module.exports.RENDER_SIGNUP = renderSignUp;
module.exports.RENDER_LOGIN = renderLogin;
module.exports.LOGOUT = logout;
