const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citizenHistorySchema = new Schema(
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
    version: {
			type: Number,
			required: true,
		},
    citizen_id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'Citizen'
    },
    index: {
      type: String,
      required: false
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Citizen_History', citizenHistorySchema);
