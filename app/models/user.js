const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  organization: { type: String },
  phone: { type: String },
  servers: [Schema.Types.ObjectId],
  verified: { type: Boolean, required: true, default: false },
  createdOn: { type: Date, required: true, default: Date.now() },
  isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.plugin(unique);

module.exports = mongoose.model('user', userSchema);
