const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('config');
require('dotenv').config();

const { NotAuthenticatedError } = require('../utils/error');

const authService = require('../services/auth');
const userService = require('../services/user');

const client = require('twilio')(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

exports.login = async (req, res, next) => {
	const { phone, password, role } = req.body;
	const check_user = await userService.getUserByPhoneRole({ phone, role });
	if (!check_user) {
		throw new NotAuthenticatedError('User not found');
	}

	const isEqual = bcrypt.compare(password, check_user.password);
	if (!isEqual) {
		const err = new Error('Wrong password.');
		err.statusCode = 401;
		throw err;
	}

	const { access_token, refresh_token, user } = await authService.signJWT({
		id: check_user._id,
		role: check_user.role,
		status: check_user.status,
		citizen_id: check_user.citizen_id,
		phone: check_user.phone,
	});
	req.session = { access_token };
	req.user = user;

	res.status(200).json({
		response_status: 1,
		message: 'Login successfully!',
		data: {
			refresh_token,
		},
	});
};

exports.generateToken = async (req, res, next) => {
	const { refresh_token } = req.body;
	if (!refresh_token) {
		const err = new Error('Not authenticated.');
		err.statusCode = 401;
		throw err;
	}
	const access_token = await authService.getAccessToken(refresh_token);
	if (access_token) {
		req.session = { access_token };
		return res.status(200).json({
			response_status: 1,
			message: 'Refresh token successfully!',
			data: {
				access_token,
			},
		});
	} else {
		req.session = null;
		req.user = null;
		const err = new Error('Invalid refresh token..');
		err.statusCode = 401;
		throw err;
	}
};

exports.genResetToken = async (req, res, next) => {
	crypto.randomBytes(3, async (error, buffer) => {
		const { phone } = req.body;
		if (error) {
			error.statusCode = 400;
			throw error;
		}
		const user = await userService.getUserByPhone({ phone });
		await authService.genResetToken(buffer, user);

		client.messages
			.create({
				to: '+84584702251', //? for test, replace with:
				// to: "+84" + user.phone.slice(1)
				messagingServiceSid: 'MGbcf508135477891aba4f642cbe199f6e',
				body: `Your reset password code is ${token}`,
				from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
			})
			.then((message) => {
				// console.log(message.sid);
			})
			.done();

		res.status(200).json({
			response_status: 1,
			message: 'Reset token saved!',
		});
	});
};

exports.resetPassword = async (req, res, next) => {
	const { token, newPassword } = req.body;
	await authService.resetPassword();

	client.messages
		.create({
			to: '+84584702251', //? for test, replace with:
			// to: "+84" + user.phone.slice(1)
			body: `Password updated successfully!`,
			from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
		})
		.then((message) => {
			console.log(message.sid);
		})
		.done();

	res.status(200).json({
		response_status: 1,
		message: 'New password updated!',
	});
};

exports.logout = async (req, res, next) => {
	await authService.logout(req.user._id);
	req.user = null;
	req.session = null;
	res.status(200).json({
		response_status: 1,
		message: 'Logout successfully!',
	});
};
