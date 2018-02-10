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

const strategies = require('./config/strategies');
const authHelpers = require('./helpers/auth');
const authRoutes = require('./app/routes/auth');
const errorRoutes = require('./app/routes/error');
// const userRoutes = require('./app/routes/user');
const clientRoutes = require('./app/routes/client');

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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app/views'));

app.use('/assets', express.static('app/assets'));
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

// Routes
// app.use('/user', userRoutes);
app.use(authRoutes);
app.use(clientRoutes);
app.use(errorRoutes);

// Launch Server
app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log(`\nListening for requests...`);
});
