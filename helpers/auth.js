const User = require('../app/models/user');

// Redirect to Login Page if not authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated() || req.path.includes('/assets')) {
    next();
  } else {
    res.redirect('/login');
  }
}

function onlyUnauthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
}

function ensureAdmin(req, res, next) {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    if (err) return next(err);
    if (doc.isAdmin) {
      return next();
    } else {
      res.redirect('back');
    }
  });
}

function unconfirmed(req, res, next) {
  if (req.user && false === req.user.verified) {
    res.redirect('confirm');
  } else {
    next();
  }
}

/* TODO: Update OAuth Handler */
function handleOAuth(req, accessToken, refreshToken, profile, done) {
  if (!req.user) {
    const { displayName, id } = profile;

    User.findOne({ googleID: id }, (err, doc) => {
      // Check for existing doc and return it, if found
      if (err) {
        return done(err, doc);
      } else if (doc) {
        // Update doc and return, if found
        const options = {
          new: true,
          upsert: true,
        };

        return User.findByIdAndUpdate(
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

      return User.create(data, done);
    });
  }
}

// Passport Auth Helpers
function serializeUser(user, done) {
  done(null, user._id);
}

function deserializeUser(id, done) {
  User.findById(id, (err, user) => {
    done(err, user);
  });
}

module.exports.HANDLE_OAUTH = handleOAuth;
module.exports.ENSURE_AUTH = ensureAuth;
module.exports.SERIALIZE_USER = serializeUser;
module.exports.DESERIALIZE_USER = deserializeUser;
module.exports.ONLY_UNAUTHENTICATED = onlyUnauthenticated;
module.exports.UNCONFIRMED = unconfirmed;
module.exports.ENSURE_ADMIN = ensureAdmin;
