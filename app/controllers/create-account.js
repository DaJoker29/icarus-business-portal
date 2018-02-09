const bcrypt = require('bcrypt');
const user = require('../models').USER;

/* TODO: Looks ugly. Refactor.*/
/* TODO: Pre-Check for Username Validity */
/* TODO: Email Confirmation */

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  console.log(req);
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
        if (err) return next(err);
        req.login(user, err => {
          if (err) return next(err);
          return next();
        });
      });
    });
  });
}

module.exports.CREATE_ACCT = createAccount;
