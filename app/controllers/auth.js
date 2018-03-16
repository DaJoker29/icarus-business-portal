const VError = require('verror');
const bcrypt = require('bcrypt');
const debug = require('debug')('icarus-auth');
const { User } = require('../models');

function changePassword(req, res, next) {
  const { _id } = req.user;
  const { currentPassword, newPassword } = req.body;
  const saltRounds = 10;

  return User.findById(_id, 'passwordHash')
    .then(({ passwordHash }) => bcrypt.compare(currentPassword, passwordHash))
    .then(result => {
      if (result) return bcrypt.hash(newPassword, saltRounds);
      throw new VError('Incorrect Password');
    })
    .then(passwordHash => {
      return User.findOneAndUpdate({ _id }, { passwordHash }, { new: true });
    })
    .then(user => debug(`New password created for user ${user.email}`))
    .then(res.redirect('/logout'))
    .catch(e => next(new VError(e, 'Problem creating new password')));
}

async function createPassword(req, res, next) {
  const { password } = req.body;
  const saltRounds = 10;

  return Promise.all([req.user, bcrypt.hash(password, saltRounds)])
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

function renderLogin(req, res) {
  res.render('login', {
    title: 'Welcome',
  });
}

function logout(req, res) {
  req.logout();
  res.redirect('/login');
}

module.exports.CREATE_PASSWORD = createPassword;
module.exports.CHANGE_PASSWORD = changePassword;
module.exports.RENDER_LOGIN = renderLogin;
module.exports.LOGOUT = logout;
