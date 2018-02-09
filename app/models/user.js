const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  organization: { type: String },
  phone: { type: String },
  servers: [Schema.Types.ObjectId],
  // TODO: Expand User Model (createdOn, preferredContactMethod)
});

userSchema.plugin(unique);

module.exports = mongoose.model('user', userSchema);
