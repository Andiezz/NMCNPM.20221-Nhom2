const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardIdentityHistorySchema = new Schema(
  {
    card_id: {
      type: String,
      required: true,
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
    originalCard: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'Card_Identity'
    },
    version: {
			type: Number,
			required: true,
		},
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Card_Identity_History', cardIdentityHistorySchema);