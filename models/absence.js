const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const absenceSchema = new Schema({
  citizen_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Citizen"
  },
  code: {
    type: String,
    required: true,
  },
  place: {
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
    ref: 'User'
  },
});

module.exports = mongoose.model('Absence', absenceSchema);
