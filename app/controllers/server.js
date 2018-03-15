const VError = require('verror');
const { Server, Resource } = require('../models');

function renderServerDetail(req, res, next) {
  const { id } = req.params;
  const { user } = req;

  Promise.all([
    Server.findOne({ LINODEID: id }).populate('domains'),
    Resource.find({}, null, { sort: { createdAt: -1 } }),
  ])
    .then(([server, resources]) => {
      if (user.email === server.assignedTo) {
        const resource = resources.find(e => e.hostname === server.LABEL);
        return res.render('server', {
          user,
          server: Object.assign(
            {},
            JSON.parse(JSON.stringify(server)),
            JSON.parse(JSON.stringify(resource || {})),
          ),
        });
      }
      throw new VError('Server not assigned to that user');
    })
    .catch(e => next(new VError(e, 'Problem rendering server page')));
}

module.exports.RENDER_SERVER_DETAIL = renderServerDetail;
