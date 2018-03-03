const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentSchema = new Schema({
  date: { type: Date, default: Date.now(), required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  owner: { type: String, required: true },
});

module.exports = mongoose.model('payment', paymentSchema);
