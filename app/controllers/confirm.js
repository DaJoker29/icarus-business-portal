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
  return res.render('confirm', {
    email: req.query.email ? req.query.email : '',
  });
}

function resendConfirmation(req, res) {
  if (req.body.email) {
    createConfirmation(req.body.email);
  }
  return res.redirect(`/confirm?email=${req.body.email}`);
}

function createConfirmation(email) {
  return User.findOne({ email })
    .then(user => {
      if (user) {
        return Confirm.findOne({ email });
      }
      throw new VError(`That user does not exist.`);
    })
    .then(confirm => {
      debug(`Sending confirmation token to: ${email}`);
      if (confirm) {
        return confirm;
      } else {
        return Confirm.create({ email });
      }
    })
    .then(confirm => sendToken(confirm))
    .catch(e => {
      debug(new VError(e, 'Problem finding confirmation record'));
    });
}

function sendToken(object) {
  const { email, token } = object;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm you Email Address',
    text: `Howdy!\n\nPlease confirm your address by clicking this link: ${
      process.env.HOST
    }/confirm/${token}`,
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
module.exports.CREATE_CONFIRM = createConfirmation;
