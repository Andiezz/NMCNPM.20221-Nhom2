const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionHistorySchema = new Schema(
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
	{ timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
	'Transaction_History',
	transactionHistorySchema
);
