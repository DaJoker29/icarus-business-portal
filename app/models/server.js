const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serverSchema = new Schema({
  assigned: { type: Boolean, required: true, default: false },
  LINODEID: { type: Number, unique: true, index: true, required: true },
  TOTALXFER: { type: Number, required: true },
  TOTALRAM: { type: Number, required: true },
  TOTALHD: { type: Number, required: true },
  LABEL: { type: String, required: true, default: 'No Label' },
  STATUS: { type: Number, required: true },
  DATACENTERID: { type: Number, required: true },
  CREATE_DT: { type: Date, required: true },
  PLANID: { type: Number, required: true },
  DISTRIBUTIONVENDOR: {
    type: String,
    required: true,
    default: 'NO Distribution/Vendor',
  },
});

module.exports = mongoose.model('server', serverSchema);
