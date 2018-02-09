// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
// const authHelpers = require('../helpers').AUTH;
const User = require('../app/models/user');
const bcrypt = require('bcrypt');

// const handleOAuth = authHelpers.HANDLE_OAUTH;

/* TODO: Add Google/Facebook Social Login Strategy */

const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, cb) => {
    User.findOne({ email }, 'passwordHash email', (err, doc) => {
      if (err) {
        return cb(err);
      } else if (!doc) {
        // If no user found
        return cb(null, false);
      } else {
        // If user found, check for password...
        bcrypt.compare(password, doc.passwordHash, (err, res) => {
          if (err) return cb(err);
          if (res === false) {
            return cb(null, false);
          } else {
            return cb(null, doc);
          }
        });
      }
    });
  },
);

// const googleStrategy = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.HOSTNAME ||
//       `http://localhost:${port}`}/auth/google/callback`,
//     passReqToCallback: true,
//   },
//   handleOAuth,
// );

// const facebookStrategy = new FacebookStrategy(
//   {
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: `${process.env.HOSTNAME ||
//       `http://localhost:${port}`}/auth/facebook/callback`,
//     passReqToCallback: true,
//     profileFields: [
//       'id',
//       'displayName',
//       'email',
//       'birthday',
//       'friends',
//       'first_name',
//       'last_name',
//       'middle_name',
//       'gender',
//       'link',
//     ],
//   },
//   handleOAuth,
// );

// module.exports.GOOGLE = googleStrategy;
// module.exports.FACEBOOK = facebookStrategy;
module.exports.LOCAL = localStrategy;
