const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketSchema = new Schema({
  createdAt: { type: Date, default: Date.now(), required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  subject: { type: String, required: true },
  isAssigned: { type: Boolean, required: true, default: false },
  isCompleted: { type: Boolean, required: true, default: false },
  isClosed: { type: Boolean, required: true, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
});

module.exports = mongoose.model('ticket', ticketSchema);
