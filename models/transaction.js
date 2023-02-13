const mongoose = require('mongoose');
const Transaction_History = require('./transactionHistory');

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    fee_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Fee',
      required: true,
    },
    household_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Household',
      required: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    cost: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    stage: Number,
  },
  { timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

// transactionSchema.pre('save', async function (next) {
//   const history = new Transaction_History();
//   if (this.version != null) {
//     history.fee_id = this.fee_id;
//     history.household_id = this.household_id;
//     history.cost = this.cost;
//     history.status = this.status;
//     history.version = this.version + 1;
//   } else {
//     history.fee_id = this.fee_id;
//     history.household_id = this.household_id;
//     history.cost = this.cost;
//     history.status = this.status;
//     history.version = 0;
//   }
//   await history.save();
//   next();
// });

module.exports = mongoose.model('Transaction', transactionSchema);
