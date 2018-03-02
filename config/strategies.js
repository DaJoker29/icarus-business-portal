const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const VError = require('verror');
const models = require('../app/models');

const User = models.USER;

const local = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email }, 'passwordHash email', (err, doc) => {
      if (err) {
        return done(new VError(err, 'Problem retrieving user info'));
      }
      if (doc) {
        return bcrypt.compare(password, doc.passwordHash, (error, res) => {
          if (error) {
            return done(new VError(error, 'Problem confirming password'));
          }
          if (res === false) {
            return done(null, false);
          }
          return done(null, doc);
        });
      } else {
        return done(new VError('No user matching that email address'));
      }
    });
  },
);

module.exports.LOCAL = local;
