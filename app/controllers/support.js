const debug = require('debug')('icarus-support');
const { Message } = require('../models');

function renderSupport(req, res) {
  return Message.find({ owner: req.user.email }, null, { sort: { date: -1 } })
    .then(messages => {
      res.render('support', {
        title: 'Contact Support',
        user: req.user,
        messages,
      });
    })
    .catch(e => {
      debug(`Error fetching messages: ${e}`);
    });
}

async function submitMessage(req, res, next) {
  const { message } = req.body;
  const { email } = req.user;
  const newMessage = new Message({ content: message, owner: email });
  await newMessage
    .save()
    .then(doc => {
      debug(`Message saved: ${doc}`);
      res.redirect('/support');
    })
    .catch(e => {
      debug(`Error saving message: ${e}`);
      next(new Error(e, `Error submitting message from user: ${email}`));
    });
}

module.exports.RENDER_SUPPORT = renderSupport;
module.exports.SUBMIT_MESSAGE = submitMessage;
