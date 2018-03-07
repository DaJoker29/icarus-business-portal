const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const randToken = require('rand-token');

const { Schema } = mongoose;

const confirmSchema = new Schema({
  email: { type: String, required: true },
  token: {
    type: String,
    unique: true,
    default: randToken.generate(16),
  },
  createdAt: { type: Date, expires: 60 * 60 * 24 * 7, default: Date.now() },
});

confirmSchema.plugin(unique);

module.exports = mongoose.model('confirm', confirmSchema);
