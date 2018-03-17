const VError = require('verror');
const debug = require('debug')('icarus-admin');
const {
  User,
  Server,
  Resource,
  Ticket,
  Payment,
  Comment,
} = require('../models');

function renderAdmin(req, res, next) {
  Promise.all([
    User.find(),
    Server.find({}, null, { sort: { expires: 1 } }).populate('assignedTo'),
    Resource.find({}, null, { sort: { createdAt: -1 } }),
    Ticket.find({ isClosed: false }, null, {
      sort: { isCompleted: 1, date: -1 },
    }).populate({
      path: 'createdBy comments',
      populate: { path: 'commenter' },
    }),
    Payment.find({}, null, { sort: { created: -1 } }),
  ])
    .then(([users, servers, resources, tickets, payments]) => {
      res.render('admin', {
        title: 'Admin Panel',
        user: req.user,
        servers,
        users,
        resources,
        tickets,
        payments,
      });
    })
    .catch(e => next(new VError(e, 'Problem rendering admin page')));
}

async function changeServerInfo(req, res, next) {
  if (req.body) {
    await Server.findOneAndUpdate(
      { LINODEID: req.params.id },
      { $set: req.body },
    )
      .then(server =>
        debug(`Server ${server.LINODEID} updated: ${JSON.stringify(req.body)}`),
      )
      .catch(e => next(new VError(e, 'Problem changing server information')));
  }
  res.redirect('/admin');
}

function renderUserDetail(req, res, next) {
  const { id } = req.params;
  return Promise.all([User.findById(id), Payment.find({ userId: id })])
    .then(([user, payments]) => {
      res.render('admin-user', {
        user: req.user,
        selectedUser: user,
        payments,
      });
    })
    .catch(e => next(new VError(e, 'Problem rendering user detail page')));
}

function renderServerDetail(req, res, next) {
  const { id } = req.params;
  return Server.findById(id)
    .populate('domains assignedTo')
    .then(server => {
      res.render('admin-server', { user: req.user, server });
    })
    .catch(e => next(new VError(e, 'Problem rendering server dtail page')));
}

function commentOnTicket(req, res, next) {
  const { id } = req.params;
  const { message } = req.body;
  return Comment.create({ message, commenter: req.user._id, ticket: id })
    .then(comment => {
      debug(`Admin Comment created ${comment._id}`);
      return Ticket.findOneAndUpdate(
        { _id: comment.ticket },
        { $push: { comments: comment._id } },
        { new: true },
      );
    })
    .then(ticket => {
      debug(`Admin commented on ticket: ${ticket._id}`);
      return res.redirect('/admin');
    })
    .catch(e => next(new VError(e, 'Problem saving admin comment on ticket')));
}

function closeTicket(req, res, next) {
  const { id } = req.params;
  return Ticket.findOneAndUpdate({ _id: id }, { isClosed: true }, { new: true })
    .then(ticket => {
      debug(`Ticket closed: ${ticket._id}`);
      return res.redirect('/admin');
    })
    .catch(e => next(new VError(e, 'Problem closing ticket')));
}

function completeTicket(req, res, next) {
  const { id } = req.params;
  return Ticket.findOneAndUpdate(
    { _id: id },
    { isCompleted: true },
    { new: true },
  )
    .then(ticket => {
      debug(`Ticket completed: ${ticket._id}`);
      return res.redirect('/admin');
    })
    .catch(e => next(new VError(e, 'Problem marking ticket complete')));
}

function assignTicket(req, res, next) {
  const { id } = req.params;
  return Ticket.findOneAndUpdate(
    { _id: id },
    { isAssigned: true },
    { new: true },
  )
    .then(ticket => {
      debug(`Ticket assigned: ${ticket._id}`);
      return res.redirect('/admin');
    })
    .catch(e => next(new VError(e, 'Problem assigning ticket')));
}

module.exports.COMPLETE_TICKET = completeTicket;
module.exports.ASSIGN_TICKET = assignTicket;
module.exports.CLOSE_TICKET = closeTicket;
module.exports.COMMENT_TICKET = commentOnTicket;
module.exports.RENDER_SERVER_DETAIL = renderServerDetail;
module.exports.RENDER_USER_DETAIL = renderUserDetail;
module.exports.RENDER_ADMIN = renderAdmin;
module.exports.CHANGE_SERVER_INFO = changeServerInfo;
