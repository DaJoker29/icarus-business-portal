const VError = require('verror');
const debug = require('debug')('icarus-resource');
const { Resource } = require('../models');

function createResource(req, res, next) {
  const ipAddress = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',').pop()
    : req.connection.remoteAddress;

  debug(`Resource ping from ${ipAddress}`);
  if (req.body && req.body.hostname) {
    const {
      hostname,
      uptime,
      usedMem,
      totalMem,
      load,
      usedDisk,
      totalDisk,
    } = req.body;
    const params = {
      hostname,
      uptime,
      usedMem,
      totalMem,
      load,
      usedDisk,
      totalDisk,
      ipAddress,
    };

    return Resource.create(params)
      .then(() => res.sendStatus(200))
      .catch(e => next(new VError(e, 'Problem creating new resource')));
  }
  return res.sendStatus(400);
}

module.exports.CREATE_RESOURCE = createResource;
