const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  passwordHash: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  organization: { type: String },
  phone: { type: String },
  createdOn: { type: Date, required: true, default: Date.now() },
  isVerified: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
  stripeID: { type: String },
});

userSchema.plugin(unique);

module.exports = mongoose.model('user', userSchema);
