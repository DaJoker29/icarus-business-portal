const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('../helpers').AUTH;

const handleOAuth = authHelpers.HANDLE_OAUTH;
const port = process.env.PORT || 3000;

const localStrategy = new LocalStrategy((username, password, cb) => {
  user.findOne({ email: username }, (err, doc) => {
    if (err) {
      return cb(err);
    } else if (doc) {
      // Check for password...
      bcrypt.compare(password, doc.passwordHash, (err, res) => {
        if (err) return cb(err);
        if (res === false) {
          return cb(null, false);
        } else {
          return cb(null, user);
        }
      })
      
    }
  });
});

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
