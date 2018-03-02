const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const morganDebug = require('morgan-debug');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const moment = require('moment');
const phoneNumber = require('libphonenumber-js');
const numeral = require('numeral');
const VError = require('verror');
const debug = require('debug')(
  `icarus-${process.env.NODE_ENV === 'development' ? 'test-init' : 'init'}`,
);

const sep = '----------------------------------\n';

const config = require('./config');
const helpers = require('./helpers');
const routes = require('./app/routes');

const app = express();

/* Check for environment variables. */
if (result.error) {
  throw new VError(result.error, 'Problem loading environment variables...');
} else {
  debug(`${sep}Loading environment variables:`);
  Object.entries(result.parsed).forEach(rule => {
    debug(`${rule[0]} set to ${rule[1]}`);
  });
}

// Database Connection Handlers
mongoose.connection.on('error', err => {
  if (err) throw new VError(err, 'Problem connecting to database.');
});

mongoose.connection.on('disconnected', () => {
  debug('Disconnected from database');
});

mongoose.connection.on('connected', () => {
  debug('Successfully connected to database...');

  const sessionSettings = {
    resave: false,
    secret: process.env.SESSION_SECRET || 'superdupersekrit',
    saveUninitialized: false,
    store: new RedisStore({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    }),
  };

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'app/views'));

  app.use('/assets', express.static('app/assets'));
  app.use('/.well-known', express.static('.well-known', { dotfiles: 'allow' }));
  app.use(
    morganDebug(
      'icarus-morgan',
      process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
    ),
  );
  app.use(bodyParser.urlencoded({ extended: 'true' }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(helmet());
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.moment = moment;
  app.locals.phoneNumber = phoneNumber;
  app.locals.numeral = numeral;

  passport.use(config.STRATEGIES.LOCAL);
  passport.serializeUser(helpers.AUTH.SERIALIZE_USER);
  passport.deserializeUser(helpers.AUTH.DESERIALIZE_USER);

  // Load Routes dynamically
  debug(`${sep}Loading in routes`);
  Object.entries(routes).forEach(route => {
    debug(`Loading ${route[0]} routes`);
    app.use(route[1]);
  });

  // Launch Server
  app.listen(
    process.env.NODE_ENV === 'production'
      ? process.env.PORT
      : process.env.TEST_PORT,
    err => {
      if (err) throw err;
      debug(`${sep}Icarus is flying UP & UP...`);
    },
  );
});

debug(`${sep}Connecting to database...`);
mongoose.connect(
  process.env.NODE_ENV === 'production' ? process.env.DB : process.env.TEST_DB,
);

function gracefulExit() {
  debug(`${sep}Icarus is going DOWN...`);
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

/* Termination and Uncaught Exception Handlers */
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
process.on('uncaughtException', err => {
  console.error(err.stack);
  debug('Icarus flew too high to the sun and CRASHED to the waves below...');
  gracefulExit();
});
