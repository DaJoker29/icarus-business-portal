#!/usr/bin/env node

const os = require('os');
const du = require('diskusage');

let path = os.platform() === 'win32' ? 'c:' : '/';

const object = {
  load: os.loadavg(),
  freeMem: os.freemem(),
  totalMem: os.totalmem(),
  hostname: os.hostname(),
  network: os.networkInterfaces().lo,
  uptime: os.uptime(),
  disk: du.checkSync(path),
};

console.log(object);
