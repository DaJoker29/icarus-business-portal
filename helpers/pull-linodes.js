#!/usr/bin/env node
const dotenv = require('dotenv');
const request = require('request');
dotenv.config();

const linodeAPI = 'https://api.linode.com/';

const requestParams = {
  api_key: process.env.LINODE_API_KEY,
  api_action: 'linode.list',
};

function populateLinodes() {
  request({ url: linodeAPI, qs: requestParams }, (err, res, body) => {
    if (err) {
      console.log(err);
      return;
    }
    const data = JSON.parse(body);
    console.log(data.DATA);
  });
}

populateLinodes();
