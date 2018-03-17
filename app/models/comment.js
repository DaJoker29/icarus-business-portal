const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  createdAt: { type: Date, default: Date.now(), required: true },
  message: { type: String, required: true },
  commenter: { type: Schema.Types.ObjectId, ref: 'user' },
  ticket: { type: Schema.Types.ObjectId, ref: 'ticket' },
});

module.exports = mongoose.model('comment', commentSchema);
