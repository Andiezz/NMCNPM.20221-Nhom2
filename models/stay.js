const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staySchema = new Schema({
  citizen_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  date: {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
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

module.exports = mongoose.model('Stay', staySchema);
