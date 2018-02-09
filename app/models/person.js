const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const personSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  passwordSalt: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  organization: { type: String },
  phone: { type: String }
  servers: [Schema.Types.ObjectId]
});

personSchema.plugin(unique);

module.exports.person = mongoose.model('person', personSchema);