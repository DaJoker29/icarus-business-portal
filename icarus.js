const dotenv = require('dotenv');
const result = dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
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
  `icarus:${'development' === process.env.NODE_ENV ? 'test:init' : ':init'}`,
);

const strategies = require('./config/strategies');
const authHelpers = require('./helpers/auth');
const routes = require('./app/routes');
// const authRoutes = require('./app/routes/auth');
// const errorRoutes = require('./app/routes/error');
// const userRoutes = require('./app/routes/user');
// const resourceRoutes = require('./app/routes/resource');
// const confirmRoutes = require('./app/routes/confirm');

const app = express();

/* Error/Shutdown Handling */
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
process.on('uncaughtException', err => {
  console.error(err.stack);
  debug('Icarus flew too high to the sun and CRASHED to the waves below...');
  gracefulExit();
});

/* Check for ENV variables. */
if (result.error) {
  throw new VError(result.error, 'Problem loading environment variables...');
} else {
  for (const [key, value] of Object.entries(result.parsed)) {
    debug(`${key} set to ${value}`);
  }
}

mongoose.connection.on('error', err => {
  if (err)
    throw new VError(err, 'Problem connecting to database. Is Mongo active?');
});

mongoose.connection.on('disconnected', () => {
  debug('Database connection has closed.');
});

mongoose.connection.on('connected', () => {
  debug(`Successfully connected to database...`);

  const sessionSettings = {
    resave: false,
    secret: process.env.SESSION_SECRET || 'superdupersekrit',
    saveUninitialized: false,
    store: new RedisStore({
      host: 'localhost',
      port: process.env.REDIS_PORT || 6379,
    }),
  };

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'app/views'));

  app.use('/assets', express.static('app/assets'));
  app.use('/.well-known', express.static('.well-known', { dotfiles: 'allow' }));
  app.use(morgan('development' === process.env.NODE_ENV ? 'dev' : 'combined'));
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

  passport.use(strategies.LOCAL);
  passport.serializeUser(authHelpers.SERIALIZE_USER);
  passport.deserializeUser(authHelpers.DESERIALIZE_USER);

  // Load Routes dynamically
  Object.entries(routes).forEach(route => {
    debug(`Loading ${route[0]} routes`);
    app.use(route[1]);
  });

  // Launch Server
  app.listen(
    'production' === process.env.NODE_ENV
      ? process.env.PORT
      : process.env.TEST_PORT,
    err => {
      if (err) throw err;
      debug('Icarus is flying UP & UP...');
    },
  );
});

debug('Connecting to database...');
mongoose.connect(
  'production' === process.env.NODE_ENV ? process.env.DB : process.env.TEST_DB,
);

function gracefulExit() {
  debug('Icarus is going DOWN...');
  if (1 === mongoose.connection.readyState) {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}
