const models = require('../models');
const VError = require('verror');

const Resource = models.RESOURCE;

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

    return Resource.create(params, err => {
      if (err) {
        return next(new VError(err, 'Problem creating new resource'));
      }
      return res.sendStatus(200);
    });
  } else {
    return res.sendStatus(400);
  }
}

module.exports.CREATE_RESOURCE = createResource;
