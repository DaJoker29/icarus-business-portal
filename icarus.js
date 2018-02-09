const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const routes = require('./app/routes');
const config = require('./config').SERVER;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

console.log('Icarus is taking flight...\n')
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

mongoose.connect(config.db);
mongoose.connection.on('connected', () => {
  console.log(`DB_URL: ${config.db}`);
});

// User Routes
app.use('/user', routes.USER);

// Catch-All Route for Errors
app.get('*', (req, res) => {
  res.send('Does not compute.');
});

// Launch Server
app.listen(config.port, err => {
  if (err) throw err;
  console.log(`PORT: ${config.port}`);
});
