const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Confirm = require('../models/confirm');

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

/* TODO: Looks ugly. Refactor.*/

function createAccount(req, res, next) {
  const { email, firstName, lastName, organization, phone } = req.body;
  const saltRounds = 10;

  // Generate Salt/Hash
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) return next(err);

      // Build new User object
      const userData = {
        email,
        firstName,
        lastName,
        organization,
        phone,
        passwordHash: hash,
      };

      // Submit new User object.
      User.create(userData, (err, user) => {
        if (err) {
          if (err.message.startsWith('user validation failed')) {
            res.render('signup', {
              error: 'That email address is already in use',
            });
          }
          return next(err);
        }
        confirmUser(user.email);
        return res.redirect('/confirm', { email });
      });
    });
  });
}

/* TODO: Email Confirmation */
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
          { verified: true },
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

module.exports.CREATE_ACCT = createAccount;
module.exports.RESEND_CONFIRM = resendConfirmation;
module.exports.CONFIRM_TOKEN = confirmToken;
