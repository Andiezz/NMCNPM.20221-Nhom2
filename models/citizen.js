const mongoose = require('mongoose');

const Citizen_History = require('./citizenHistory');

const Schema = mongoose.Schema;

const citizenSchema = new Schema(
  {
    household_id: {
      type: String,
    },
    card_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Card_Identity',
    },
    passport_id: {
      type: String,
      required: false,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      require: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    birthPlace: {
      type: String,
      required: true,
    },
    hometown: {
      type: String,
      required: true,
    },
    residence: {
      type: String,
      required: true,
    },
    accommodation: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    ethic: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    workplace: {
      type: String,
      required: true,
    },
    education: {
      type: Number,
      required: true,
    },
    moveIn: {
      date: {
        type: Date,
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
    },
    moveOut: {
      date: {
        type: Date,
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    index: {
      type: String,
      required: false
    }
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

citizenSchema.pre('save', async function (next) {
  const history = new Citizen_History();
  if (this.version != null) {
    history.card_id = this.card_id;
    history.household_id = this.household_id;
    history.passport_id = this.passport_id;
    history.name = this.name;
    history.gender = this.gender;
    history.dob = this.dob;
    history.birthPlace = this.birthPlace;
    history.hometown = this.hometown;
    history.residence = this.residence;
    history.accommodation = this.accommodation;
    history.religion = this.religion;
    history.ethic = this.ethic;
    history.profession = this.profession;
    history.workplace = this.workplace;
    history.education = this.education;
    history.moveIn = this.moveIn;
    history.moveOut = this.moveOut;
    history.modifiedBy = this.modifiedBy;
    history.citizen_id = this.citizen_id;
    history.index = this.index
    history.version = this.version + 1;
  } else {
    history.card_id = this.card_id;
    history.household_id = this.household_id;
    history.passport_id = this.passport_id;
    history.name = this.name;
    history.gender = this.gender;
    history.dob = this.dob;
    history.birthPlace = this.birthPlace;
    history.hometown = this.hometown;
    history.residence = this.residence;
    history.accommodation = this.accommodation;
    history.religion = this.religion;
    history.ethic = this.ethic;
    history.profession = this.profession;
    history.workplace = this.workplace;
    history.education = this.education;
    history.moveIn = this.moveIn;
    history.moveOut = this.moveOut;
    history.modifiedBy = this.modifiedBy;
    history.citizen_id = this._id;
    history.index = this.index
    history.version = 0;
  }
  await history.save();
  next();
});

module.exports = mongoose.model('Citizen', citizenSchema);
