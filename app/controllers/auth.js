const bcrypt = require('bcrypt');
const user = require('../models/user');

/* TODO: Looks ugly. Refactor.*/
/* TODO: Pre-Check for Username Validity */
/* TODO: Email Confirmation */

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

      // Submit new User object to database. If successful, log in.
      user.create(userData, (err, user) => {
        console.log(err.message);
        if (err) {
          if (err.message.startsWith('user validation failed')) {
            res.render('signup', {error: 'That email address is already in use'});
          }
          return next(err);
        }
        req.login(user, err => {
          if (err) return next(err);
          res.redirect('/');
        });
      });
    });
  });
}

module.exports.CREATE_ACCT = createAccount;
