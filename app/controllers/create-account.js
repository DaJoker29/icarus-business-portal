const user = require('../models').USER;

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(err);

      const user = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash
      };

      person.create(user, (err, user) => {
        if (err) throw err;
        next(err, user);
      });
    });
  });
}

module.exports.CREATE_ACCT = createAccount;