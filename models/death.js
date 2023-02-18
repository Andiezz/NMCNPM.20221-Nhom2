const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deathSchema = new Schema({
  citizen_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Citizen'
  },
  code: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  modifiedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Death', deathSchema);
