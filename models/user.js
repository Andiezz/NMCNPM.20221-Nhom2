const mongoose = require('mongoose');
const User_History = require('./userHistory');

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
    const history = new User_History();
    history.role = this.role;
    history.status = this.status;
    history.citizen_id = this.citizen_id;
    history.phone = this.phone;
    history.version = this.version;
    await history.save();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
