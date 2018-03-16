const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketSchema = new Schema({
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 60 * 60 * 24 * 180,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  isAssigned: { type: Boolean, required: true, default: false },
  isComplete: { type: Boolean, required: true, default: false },
  isClosed: { type: Boolean, required: true, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
});

module.exports = mongoose.model('ticket', ticketSchema);
