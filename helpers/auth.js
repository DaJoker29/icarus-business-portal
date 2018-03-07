const VError = require('verror');
const { User } = require('../app/models');

function authenticated(req, res, next) {
  if (
    req.isAuthenticated() ||
    req.path.includes('/assets') ||
    req.path.includes('/.well-known')
  ) {
    return next();
  }
  return res.redirect('/login');
}

function unauthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

function admin(req, res, next) {
  if (req.user.isAdmin) {
    return User.findOne({ _id: req.user._id }, (err, doc) => {
      if (err) {
        return next(new VError(err, 'Problem while checking Admin flag'));
      }
      if (doc.isAdmin) return next();
      return res.redirect('/');
    });
  }
  return res.redirect('/');
}

function unverified(req, res, next) {
  if (req.user && req.user.isVerified === false) {
    return res.redirect('confirm');
  }
  return next();
}

function serializeUser(user, done) {
  return done(null, user._id);
}

function deserializeUser(id, done) {
  User.findById(id, (err, user) => done(err, user));
}

module.exports.AUTHENTICATED = authenticated;
module.exports.SERIALIZE_USER = serializeUser;
module.exports.DESERIALIZE_USER = deserializeUser;
module.exports.UNAUTHENTICATED = unauthenticated;
module.exports.UNVERIFIED = unverified;
module.exports.ADMIN = admin;
