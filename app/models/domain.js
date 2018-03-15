const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const { Schema } = mongoose;

const domainSchema = new Schema({
  name: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'server' },
});

domainSchema.plugin(unique);

module.exports = mongoose.model('domain', domainSchema);
