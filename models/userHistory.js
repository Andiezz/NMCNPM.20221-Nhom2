const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userHistorySchema = new Schema(
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
		phone: {
			type: String,
			required: true,
		},
		version: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User_History', userHistorySchema);
