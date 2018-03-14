const mongoose = require('mongoose');

const { Schema } = mongoose;

const resourceSchema = new Schema({
  hostname: { type: String, required: true },
  uptime: { type: Number },
  usedMem: { type: Number },
  totalMem: { type: Number },
  load: { type: Number },
  usedDisk: { type: Number },
  totalDisk: { type: Number },
  createdAt: { type: Date, expires: 60 * 60 * 24 * 7, default: Date.now() },
  ipAddress: { type: String },
});

module.exports = mongoose.model('resource', resourceSchema);
