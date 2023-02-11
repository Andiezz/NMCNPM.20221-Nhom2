const mongoose = require('mongoose');

const Card_Identity_History = require('./cartIdentityHistory');

const Schema = mongoose.Schema;

const cardIdentitySchema = new Schema(
  {
    card_id: {
      type: String,
      required: true,
    },
    citizen_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Citizen',
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      require: true,
    },
    expiration: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

// cardIdentitySchema.pre('save', async function (next) => {

// })

module.exports = mongoose.model('Card_Identity', cardIdentitySchema);
