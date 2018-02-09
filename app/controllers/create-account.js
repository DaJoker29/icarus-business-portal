const bcrypt = require('bcrypt');
const user = require('../models').USER;

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  console.log(req);
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(err);

      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

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
