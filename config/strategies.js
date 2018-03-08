const { Strategy: LocalStrategy } = require('passport-local');

const bcrypt = require('bcrypt');
const VError = require('verror');
const { User } = require('../app/models');

const local = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email }, 'passwordHash email')
      .then(doc => {
        const found = bcrypt.compareSync(password, doc.passwordHash);
        return done(null, found ? doc : false);
      })
      .catch(e => done(new VError(e, 'Problem with authentication')));
  },
);

module.exports.LOCAL = local;
