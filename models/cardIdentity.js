const mongoose = require('mongoose');

const Card_Identity_History = require('./cartIdentityHistory');

const Schema = mongoose.Schema;

const cardIdentitySchema = new Schema(
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
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

cardIdentitySchema.pre('save', async function (next) {
  const history = new Card_Identity_History();
  if (this.version != null) {
    history.card_id = this.card_id;
    history.location = this.location;
    history.date = this.date;
    history.expiration = this.expiration;
    history.originalCard = this.originalCard;
    history.version = this.version + 1;
  } else {
    history.card_id = this.card_id;
    history.location = this.location;
    history.date = this.date;
    history.expiration = this.expiration;
    history.originalCard = this._id;
    history.version = 0;
  }
  await history.save();
  next();
});

module.exports = mongoose.model('Card_Identity', cardIdentitySchema);
