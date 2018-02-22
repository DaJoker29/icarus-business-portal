const User = require('../app/models/user');

// Redirect to Login Page if not authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated() || req.path.includes('/assets') || req.path.includes('/.well-known')) {
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
  if (req.user && false === req.user.isVerified) {
    res.redirect('confirm');
  } else {
    next();
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

module.exports.ENSURE_AUTH = ensureAuth;
module.exports.SERIALIZE_USER = serializeUser;
module.exports.DESERIALIZE_USER = deserializeUser;
module.exports.ONLY_UNAUTHENTICATED = onlyUnauthenticated;
module.exports.UNCONFIRMED = unconfirmed;
module.exports.ENSURE_ADMIN = ensureAdmin;
