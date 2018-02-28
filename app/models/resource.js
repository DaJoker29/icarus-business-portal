const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  hostname: { type: String, required: true },
  uptime: { type: Number },
  freeMem: { type: Number },
  totalMem: { type: Number },
  load: { type: Number },
  availDisk: { type: Number },
  totalDisk: { type: Number },
  createdAt: { type: Date, expires: 60 * 60 * 24 * 7, default: Date.now() },
});

module.exports = mongoose.model('resource', resourceSchema);
