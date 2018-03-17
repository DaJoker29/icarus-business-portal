const debug = require('debug')('icarus-tickets');
const VError = require('verror');
const { Ticket, Comment } = require('../models');

function renderTicketing(req, res, next) {
  return Ticket.find({ createdBy: req.user._id, isClosed: false }, null, {
    sort: { date: -1 },
  })
    .populate({ path: 'comments', populate: { path: 'commenter' } })
    .then(tickets => {
      return res.render('ticketing', {
        user: req.user,
        tickets,
      });
    })
    .catch(e => next(new VError(e, 'Error rendering ticketing page')));
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
    .catch(e => next(new VError(e, 'Error submitting ticket')));
}

function submitComment(req, res, next) {
  const { id } = req.params;
  const { message } = req.body;
  return Comment.create({ message, commenter: req.user._id, ticket: id })
    .then(comment => {
      debug(`User Comment created ${comment._id}`);
      return Ticket.findOneAndUpdate(
        { _id: comment.ticket },
        { $push: { comments: comment._id } },
        { new: true },
      );
    })
    .then(ticket => {
      debug(`User commented on ticket: ${ticket._id}`);
      return res.redirect('/tickets');
    })
    .catch(e => next(new VError(e, 'Problem saving user comment on ticket')));
}

module.exports.SUBMIT_COMMENT = submitComment;
module.exports.RENDER_TICKETING = renderTicketing;
module.exports.SUBMIT_TICKET = submitTicket;
