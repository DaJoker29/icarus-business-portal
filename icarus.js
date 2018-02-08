const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const config = require('./config').SERVER;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

mongoose.connect(config.db);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${config.db}`);
});

app.listen(config.port, err => {
  if (err) throw err;
  console.log(`App listening on port ${config.port}`);
});
