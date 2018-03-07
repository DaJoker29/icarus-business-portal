const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  date: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 60 * 60 * 24 * 180,
  },
  content: { type: String, required: true },
  isAssigned: { type: Boolean, required: true, default: false },
  isComplete: { type: Boolean, required: true, default: false },
  owner: { type: String, required: true },
});

module.exports = mongoose.model('message', messageSchema);
