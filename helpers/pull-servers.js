#!/usr/bin/env node
const dotenv = require('dotenv');
const request = require('request');
const mongoose = require('mongoose');
dotenv.config();

const Server = require('../app/models/server');

mongoose.connect(process.env.DB);
mongoose.connection.on('connected', () => {
  console.log(`\nSuccessfully connected to database...`);
});

const linodeAPI = 'https://api.linode.com/';

const requestParams = {
  api_key: process.env.LINODE_API_KEY,
  api_action: 'linode.list',
};

function populateLinodes() {
  // Get list of linode instances
  console.log('pulling linodes...');
  request({ url: linodeAPI, qs: requestParams }, (err, res, body) => {
    if (err) {
      console.log(err);
      return;
    }
    // Add/Update each instance in the database
    const data = JSON.parse(body);
    const servers = data.DATA;

    console.log('linodes received: ' + servers.length);
    // Cycle through each return instance
    servers.forEach((server, index, arr) => {
      const {
        LINODEID,
        TOTALXFER,
        TOTALRAM,
        TOTALHD,
        LABEL,
        STATUS,
        DATACENTERID,
        CREATE_DT,
        PLANID,
        DISTRIBUTIONVENDOR,
      } = server;

      const update = {
        TOTALXFER,
        TOTALRAM,
        TOTALHD,
        LABEL,
        STATUS,
        DATACENTERID,
        CREATE_DT,
        PLANID,
        DISTRIBUTIONVENDOR,
      };
      console.log(`Updating Linode: ${LABEL}`);
      // If instance exists, update
      Server.update(
        { LINODEID },
        { $set: update },
        { upsert: true, setDefaultsOnInsert: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log('No errors');
          }
          if (index + 1 === arr.length) {
            mongoose.connection.close();
          }
        },
      );
    });
  });
}

populateLinodes();
