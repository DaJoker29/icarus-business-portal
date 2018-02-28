const Resource = require('../models/resource');

function newResource(req, res, next) {
  if (req.body && req.body.hostname) {
    const {
      hostname,
      uptime,
      freeMem,
      totalMem,
      load,
      availDisk,
      totalDisk,
    } = req.body;
    const params = {
      hostname,
      uptime,
      freeMem,
      totalMem,
      load,
      availDisk,
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

module.exports.newResource = newResource;
