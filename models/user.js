const mongoose = require('mongoose');
const UserHistory = require('./userHistory');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['ADMIN', 'LEADER', 'ACCOUNTANT'],
    },
    status: {
      type: Boolean,
      required: true,
      default: 1,
    },
    citizen_id: {
      type: Schema.Types.ObjectId,
      ref: 'Citizen',
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    refresh_token: String,
    resetToken: String,
    resetTokenExpiration: String,
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

userSchema.pre('save', async function (next) {
  if (this.version != null) {
    const history = new UserHistory();
    history.role = this.role;
    history.status = this.status;
    history.citizen_id = this.citizen_id;
    history.phone = this.phone;
    history.version = this.version + 1;
    await history.save();
  } else {
    const history = new UserHistory();
    history.role = this.role;
    history.status = this.status;
    history.citizen_id = this.citizen_id;
    history.phone = this.phone;
    history.version = 0;
  }
  await history.save();
  next();
});

module.exports = mongoose.model('User', userSchema);
