const debug = require('debug')('icarus-support');
const { Ticket } = require('../models');

function renderSupport(req, res) {
  return Ticket.find({ createdBy: req.user._id }, null, { sort: { date: -1 } })
    .then(tickets => {
      res.render('support', {
        title: 'Contact Support',
        user: req.user,
        tickets,
      });
    })
    .catch(e => {
      debug(`Error fetching tickets: ${e}`);
    });
}

async function submitTicket(req, res, next) {
  const { ticket } = req.body;
  const { _id } = req.user;
  const newTicket = new Ticket({ ticket, createdBy: _id });
  await newTicket
    .save()
    .then(doc => {
      debug(`Ticket saved: ${doc}`);
      res.redirect('/support');
    })
    .catch(e => {
      debug(`Error saving ticket: ${e}`);
      next(new Error(e, `Error submitting ticket from user: ${_id}`));
    });
}

module.exports.RENDER_SUPPORT = renderSupport;
module.exports.SUBMIT_TICKET = submitTicket;
