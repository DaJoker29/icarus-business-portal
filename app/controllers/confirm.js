const nodemailer = require('nodemailer');
const VError = require('verror');
const debug = require('debug')('icarus-confirm');
const { Confirm, User } = require('../models');

const smtpCreds = {
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(smtpCreds);

function renderResend(req, res) {
  return res.render('resend');
}

function renderConfirmation(req, res) {
  return res.render('confirm');
}

function resendConfirmation(req, res) {
  if (req.body.email) {
    confirmUser(req.body.email);
  }
  return res.redirect('/login');
}

function confirmToken(req, res, next) {
  if (req.params.token) {
    const { token } = req.params;
    return Confirm.findOne({ token })
      .then(({ email }) => {
        return User.findOneAndUpdate(
          { email },
          { isVerified: true },
          { upsert: true, new: true },
        );
      })
      .then(({ email }) => {
        debug(`New User Verified: ${email}`);
        return res.redirect('/');
      })
      .catch(e => next(new VError(e, 'Problem verifiying user record')));
  }
  return res.redirect('/login');
}

function confirmUser(email) {
  Confirm.findOne({ email })
    .then(confirm => {
      debug(`Sending confirmation token to: ${email}`);
      if (confirm) {
        return confirm;
      } else {
        return Confirm.create({ email });
      }
    })
    .then(confirm => sendToken(confirm))
    .catch(e => debug(new VError(e, 'Problem finding confirmation record')));
}

function sendToken(object) {
  const { email, token } = object;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm you Email Address',
    text: `Howdy!\n\nPlease confirm your address by clicking this link: ${
      process.env.HOST
    }/confirm/token/${token}`,
  };

  transporter
    .sendMail(mailOptions)
    .then(({ messageId }) => {
      debug(`Confirmation token sent: ${messageId}`);
    })
    .catch(e => debug(e));
}

module.exports.RENDER_RESEND = renderResend;
module.exports.RENDER_CONFIRM = renderConfirmation;
module.exports.RESEND_CONFIRM = resendConfirmation;
module.exports.CONFIRM_TOKEN = confirmToken;
module.exports.CONFIRM_USER = confirmUser;
