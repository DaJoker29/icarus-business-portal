const models = require('../models');

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

    Resource.create(params, err => {
      if (err) {
        next(err);
      }
      return res.sendStatus(200);
    });
  } else {
    return res.sendStatus(400);
  }
}

module.exports.CREATE_RESOURCE = createResource;
