#!/usr/bin/env node
const program = require('commander');
const dotenv = require('dotenv');
const request = require('request');
const mongoose = require('mongoose');
dotenv.config();

const Server = require('../app/models/server');
const linodeAPI = 'https://api.linode.com/';
const requestParams = {
  api_key: process.env.LINODE_API_KEY,
  api_action: 'linode.list',
};

program
  .version('0.2.0')
  .option('-d, --dev', 'Run in dev mode.')
  .parse(process.argv);

function populateLinodes() {
  mongoose.connect(program.dev ? process.env.TEST_DB : process.env.DB);
  mongoose.connection.on('connected', () => {
    console.log(
      `Connected to Database: ${
        program.dev ? process.env.TEST_DB : process.env.DB
      }. Connecting to Linode...`,
    );

    request({ url: linodeAPI, qs: requestParams }, (err, res, body) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      const data = JSON.parse(body);
      const servers = data.DATA;

      console.log(`Servers found: ${servers.length}`);
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

        console.log(`Adding Server: ${LABEL}`);
        Server.update(
          { LINODEID },
          { $set: update },
          { upsert: true, setDefaultsOnInsert: true },
          (err, doc) => {
            if (err) {
              console.log(err);
              process.exit(1);
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
  });
}

populateLinodes();
