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
		cost: {
			type: Number,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true, versionKey: 'version', optimisticConcurrency: true }
);

transactionSchema.pre('save', async function (next) {
	if (this.version != null) {
		const history = new Transaction_History();
		history.fee_id = this.fee_id;
		history.household_id = this.household_id;
		history.cost = this.cost;
		history.status = this.status;
		history.version = this.version;
		await history.save();
	}
	next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
