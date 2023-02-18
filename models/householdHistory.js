const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const householdHistorySchema = new Schema(
  {
    household_id: {
      type: String,
      required: true,
    },
    owner_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Citizen",
    },
    areaCode: {
      type: String,
      required: true,
    },
    address: {
      province: {
        type: String,
        require: true,
      },
      district: {
        type: String,
        require: true,
      },
      ward: {
        type: String,
        require: true,
      },
      no: {
        type: Number,
        require: true,
      },
    },
    members: [{
      citizen_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Citizen",
      },
      relation: {
        type: String,
        required: true,
      },
    }],
    move_in: {
      date: {
        type: Date,
        required: false
      },
      reason: {
        type: String,
        required: false
      }
    },
    move_out: {
      date: {
        type: Date,
        required: false
      },
      reason: {
        type: String,
        required: false
      }
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    original_id: {
      type: mongoose.Types.ObjectId,
      ref: "Household",
      required: false
    },
    version: {
			type: Number,
			required: true,
		},
    index: {
      type: String,
      required: false
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Household_History', householdHistorySchema);