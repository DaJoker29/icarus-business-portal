const user = require('../app/models').USER;

// Redirect to Login Page if not authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* TODO: Update OAuth Handler */
function handleOAuth(req, accessToken, refreshToken, profile, done) {
  if (!req.user) {
    const { displayName, id } = profile;

    user.findOne({ googleID: id }, (err, doc) => {
      // Check for existing doc and return it, if found
      if (err) {
        return done(err, doc);
      } else if (doc) {
        // Update doc and return, if found
        const options = {
          new: true,
          upsert: true,
        };

        return user.findByIdAndUpdate(
          doc.id,
          { googleToken: accessToken },
          options,
          done,
        );
      }

      // Create new doc, if not found
      const data = {
        displayName,
        googleID: id,
        googleToken: accessToken,
      };

      return user.create(data, done);
    });
  }
}

// Passport Auth Helpers
function serializeUser(user, done) {
  done(null, user._id);
}

function deserializeUser(id, done) {
  user.findById(id, (err, user) => {
    done(err, user);
  });
}

module.exports.HANDLE_OAUTH = handleOAuth;
module.exports.ENSURE_AUTH = ensureAuth;
module.exports.SERIALIZE_USER = serializeUser;
module.exports.DESERIALIZE_USER = deserializeUser;
