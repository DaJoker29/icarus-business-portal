const VError = require('verror');
const { Resource } = require('../models');

function createResource(req, res, next) {
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
    };

    return Resource.create(params)
      .then(() => res.sendStatus(200))
      .catch(e => next(new VError(e, 'Problem creating new resource')));
  }
  return res.sendStatus(400);
}

module.exports.CREATE_RESOURCE = createResource;
