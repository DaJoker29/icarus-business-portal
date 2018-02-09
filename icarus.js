const dotenv = require('dotenv');
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
const routes = require('./app/routes');
const strategies = require('./config/strategies');
const authHelpers = require('./helpers/auth');
const app = express();

console.log('Icarus is taking flight...\n');

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
  store: new RedisStore({ host: 'localhost', port: process.env.REDIS_PORT }),
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

passport.use(strategies.LOCAL);

passport.serializeUser(authHelpers.SERIALIZE_USER);
passport.deserializeUser(authHelpers.DESERIALIZE_USER);

mongoose.connect(process.env.DB);
mongoose.connection.on('connected', () => {
  console.log(`\nSuccessfully connected to database...`);
});

// Special Routes
app.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/authenticated');
  } else {
    res.sendFile(path.join(`${__dirname}/client/sign-up.html`));
  }
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/something');
  } else {
    res.sendFile(path.join(`${__dirname}/client/sign-in.html`));
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

// Routes
app.use('/user', routes.USER);
app.use('/', routes.CREATE_ACCT);

// 404s/Error Handling
app.use(routes.ERROR);

// Launch Server
app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log(`\nListening for requests...`);
});
