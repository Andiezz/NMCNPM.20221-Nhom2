const mongoose = require('mongoose');
const HouseholdHistory = require('./householdHistory');

const Schema = mongoose.Schema;

const householdSchema = new Schema(
  {
    household_id: {
      type: String,
      required: true,
    },
    owner_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Citizen',
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
    members: [
      {
        citizen_id: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Citizen',
        },
        relation: {
          type: String,
          required: true,
        },
      }
    ],
    move_in: {
      date: {
        type: Date,
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
    },
    move_out: {
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
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

householdSchema.pre('save', async function (next) {
  if (this.version != null) {
    const history = new HouseholdHistory();
    history.household_id = this.household_id;
    history.owner_id = this.owner_id;
    history.areaCode = this.areaCode;
    history.address.province = this.address.province;
    history.address.district = this.address.district;
    history.address.ward = this.address.ward;
    history.address.no = this.address.no;
    history.members = this.members;
    history.move_in.date = this.move_in.date;
    history.move_in.reason = this.move_in.reason;
    history.move_out.date = this.move_out.date;
    history.move_out.reason = this.move_out.reason;
    history.modifiedBy = this.modifiedBy;
    history.version = this.version;
    await history.save();
  }
  next();
});

module.exports = mongoose.model('Household', householdSchema);
