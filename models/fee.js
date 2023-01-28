const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feeSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		required: {
			type: Number,
			default: 0,
		},
		memberPayment: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Fee', feeSchema);
