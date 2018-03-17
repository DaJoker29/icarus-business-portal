const debug = require('debug')('icarus-tickets');
const { Ticket, Comment } = require('../models');

function renderTicketing(req, res) {
  return Ticket.find({ createdBy: req.user._id }, null, { sort: { date: -1 } })
    .populate({ path: 'comments', populate: { path: 'commenter' } })
    .then(tickets => {
      res.render('ticketing', {
        user: req.user,
        tickets,
      });
    })
    .catch(e => {
      debug(`Error fetching tickets: ${e}`);
    });
}

async function submitTicket(req, res, next) {
  const { message, subject } = req.body;
  const { _id } = req.user;
  const newTicket = new Ticket({ subject, createdBy: _id });
  await newTicket
    .save()
    .then(ticket => {
      debug(`Ticket created: ${ticket._id}`);
      return Comment.create({ message, commenter: _id, ticket: ticket._id });
    })
    .then(comment => {
      return Ticket.findOneAndUpdate(
        { _id: comment.ticket },
        { $push: { comments: comment._id } },
        { new: true },
      ).populate('comments');
    })
    .then(ticket => {
      debug(`Comment added to ticket: ${ticket.comments[0].message}`);
      return res.redirect('/tickets');
    })
    .catch(e => {
      debug(`Error saving ticket: ${e}`);
      next(new Error(e, `Error submitting ticket from user: ${_id}`));
    });
}

module.exports.RENDER_TICKETING = renderTicketing;
module.exports.SUBMIT_TICKET = submitTicket;
