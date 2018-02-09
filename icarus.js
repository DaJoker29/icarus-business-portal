const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const routes = require('./app/routes');
const config = require('./config');
const helpers = require('./helpers');
const app = express();

console.log('Icarus is taking flight...\n')

// Configure environment variables
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
console.log('Environment Variables:');
console.log(result.parsed);

// Setup Session Settings
const sessionSettings = {
  resave: false,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  store: new RedisStore({ host: 'localhost', port: process.env.REDIS_PORT}),
};

app.use(morgan('development' === process.env.NODE_ENV ? 'dev' : 'combined'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(helmet());
app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

passport.use(config.STRATEGIES.LOCAL);

passport.serializeUser(helpers.AUTH.SERIALIZE_USER);
passport.deserializeUser(helpers.AUTH.DESERIALIZE_USER);

mongoose.connect(process.env.DB);
mongoose.connection.on('connected', () => {
  console.log(`\nSuccessfully connected to database...`);
});

// User Routes
app.use('/user', routes.USER);

// Catch-All Route for Errors
app.get('*', (req, res) => {
  res.send('Does not compute.');
});

// Launch Server
app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log(`\nListening for requests...`);
});
