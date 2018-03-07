/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

function indexify(namespace) {
  const debug = require('debug')('icarus-indexing');
  const stack = callsite();
  const dir = path.dirname(stack[1].getFileName());
  const files = fs.readdirSync(dir);
  const index = {};

  files.forEach(file => {
    if (file === 'index.js') return;
    const value = file.slice(0, -3);
    const key = value.charAt(0).toUpperCase() + value.slice(1);

    index[key] = require(`${dir}/${value}`);
  });

  Object.getOwnPropertyNames(index).forEach(prop => {
    debug(`${namespace}:${prop}`);
  });
  return index;
}

module.exports = { indexify };
