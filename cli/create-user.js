#!/usr/bin/env node

const program = require('commander');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();

const User = require('../app/models/user');

program
  .option('-u, --email <email>', 'Email Address')
  .option('-p, --password <password>', 'Password')
  .option('-v, --verified', 'is Verified')
  .option('-a, --admin', 'is Admin')
  .option('-d, --dev', 'Run in dev mode')
  .parse(process.argv);

mongoose.connect(program.dev ? process.env.TEST_DB : process.env.DB);
mongoose.connection.on('connected', () => {
  const saltRounds = 10;

  // Generate Salt/Hash
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    bcrypt.hash(program.password, salt, (err2, hash) => {
      if (err2) {
        console.log(err2);
        process.exit(1);
      }

      // Build new User object
      const userData = {
        email: program.email,
        passwordHash: hash,
        isVerified: program.verified,
        isAdmin: program.admin,
      };

      // Submit new User object.
      User.create(userData, (err3, user) => {
        if (err3) {
          console.log(err3);
          process.exit(1);
        }
        console.log(`New User Created: ${user.email}`);
        mongoose.connection.close();
      });
    });
  });
});
