const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentSchema = new Schema({
  id: { type: String, required: true },
  created: { type: Date, default: Date.now(), required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  customerToken: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  currency: { type: String, required: true },
});

module.exports = mongoose.model('payment', paymentSchema);
