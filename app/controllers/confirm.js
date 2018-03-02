const nodemailer = require('nodemailer');
const models = require('../models');

const Confirm = models.CONFIRM;
const User = models.USER;

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

let transporter = nodemailer.createTransport(smtpCreds);

function renderResend(req, res) {
  res.render('resend');
}

function renderConfirmation(req, res) {
  res.render('confirm');
}

function resendConfirmation(req, res) {
  if (req.body.email) {
    confirmUser(req.body.email);
  }
  return res.redirect('/login');
}

function confirmToken(req, res) {
  if (req.params.token) {
    Confirm.findOne({ token: req.params.token }, (err, confirm) => {
      const { email } = confirm;
      if (err) throw err;
      if (confirm) {
        User.findOneAndUpdate(
          { email },
          { isVerified: true },
          { upsert: true, new: true },
          (err, user) => {
            if (err) throw err;
            return console.log(`New User Verified: ${user.email}`);
          },
        );
      }
    });
  }
  res.redirect('/login');
}

function confirmUser(email) {
  // Check if confirmation exists
  Confirm.findOne({ email }, (err, confirm) => {
    if (err) throw err;
    if (confirm) {
      // If confirmation already exists, resend current token
      sendToken(confirm);
    } else {
      // If no confirmation exists, create a new one and send it.
      Confirm.create({ email }, (err, confirm) => {
        if (err) throw err;
        sendToken(confirm);
      });
    }
  });
}

function sendToken(object) {
  const { email, token } = object;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm you Email Address',
    text: `Howdy!\n\nPlease confirm your address by clicking the following link: ${
      process.env.HOST
    }/confirm/token/${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Message sent: ${info.messageId}`);
  });
}

module.exports.RENDER_RESEND = renderResend;
module.exports.RENDER_CONFIRM = renderConfirmation;
module.exports.RESEND_CONFIRM = resendConfirmation;
module.exports.CONFIRM_TOKEN = confirmToken;
module.exports.CONFIRM_USER = confirmUser;
