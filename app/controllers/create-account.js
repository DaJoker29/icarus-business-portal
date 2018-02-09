const bcrypt = require('bcrypt');
const user = require('../models').USER;

/* TODO: Looks ugly. Refactor.*/

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  console.log(req);
  const saltRounds = 10;

  // Generate Salt
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);

    // Generate Hash
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(err);

      // Build New User Data object
      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

      // Submit new User object to database. Then log in.
      user.create(userData, (err, user) => {
        if (err) throw err;
        req.login(user, err => {
          if (err) return next(err);
          return next();
        });
      });
    });
  });
}

module.exports.CREATE_ACCT = createAccount;
