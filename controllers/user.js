const bcrypt = require('bcryptjs');
require('dotenv').config();

const { ThirdPartyError } = require('../utils/error');

const userService = require('../services/user');
const citizenService = require('../services/citizen');
const cardIdentityService = require('../services/cartIdentity');

const client = require('twilio')(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

const User = require('../models/user');
const Citizen = require('../models/citizen');

exports.register = async (req, res, next) => {
	const {
		role,
		phone,
		password,
		card_id,
    location,
    date,
    expiration,
		passport_id,
		firstName,
		lastName,
		gender,
		dob,
		birthPlace,
		hometown,
		residence,
    accommodation,
		religion,
		ethic,
		profession,
		workplace,
		education,
    moveInDate,
    moveInReason,
    moveOutDate,
    moveOutReason,
	} = req.body;
	if (!role) {
		const err = new Error('Role is required!');
		err.statusCode = 422;
		throw err;
	}

	const check_user = await userService.getUserByPhoneRole({ phone, role });

	if (check_user) {
		const err = new Error('This account has already existed!');
		err.statusCode = 400;
		throw err;
	}

	const check_citizen = await citizenService.getCitizenById({
		card_id,
		passport_id,
	});

	if (check_citizen) {
		const err = new Error('This citizen has already existed!');
		err.statusCode = 400;
		throw err;
	}

	const newCitizen = await citizenService.createNewCitizen({
		passport_id: passport_id,
		firstName: firstName,
		lastName: lastName,
		gender: gender,
		dob: dob,
		birthPlace: birthPlace,
		hometown: hometown,
		residence: residence,
    accommodation: accommodation,
		religion: religion,
		ethic: ethic,
		profession: profession,
		workplace: workplace,
		education: education,
    moveInDate: moveInDate,
    moveInReason: moveInReason,
    moveOutDate: moveOutDate,
    moveOutReason: moveOutReason
	});

  const newCardIdentity = await cardIdentityService.createNewCardIdentity({
    card_id: card_id,
    citizen_id: newCitizen._id,
    location: location,
    date: date,
    expiration: expiration
  })

	const newUser = await userService.createNewUser({
		role: role,
		phone: phone,
		password: password,
		citizen_id: newCitizen._id,
	});

	client.messages
		.create({
			to: '+84584702251', //? for test, replace with:
			// to: "+84" + newUser.phone.slice(1)
			body: 'An account with this phone number has registered successfully!',
			from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
		})
		.then((message) => {
			// console.log(message.sid);
		})
    .catch((err) => {
			console.error(err);
		})
		.done();

	res.status(200).json({
		responseStatus: 1,
		message: 'New user and citizen created!',
		data: {
			user: newUser,
			citizen: newCitizen,
      CardIdentity: newCardIdentity
		},
	});
};

exports.profile = async (req, res, next) => {
	const userId = req.params.userId;
	const check_user = await userService.getUserById({ userId });
	if (!check_user) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}
	res.status(200).json({
		message: 'User fetched!',
		user: check_user,
	});
};

exports.updateProfile = async (req, res, next) => {
	const {
		phone,
		card_id,
    location,
    date,
    expiration,
		passport_id,
		firstName,
		lastName,
		gender,
		dob,
		birthPlace,
		hometown,
		residence,
    accommodation,
		religion,
		ethic,
		profession,
		workplace,
		education,
    moveInDate,
    moveInReason,
    moveOutDate,
    moveOutReason
	} = req.body;
	const userId = req.params.userId;

	const updatedUser = await userService.updateUserProfile({
		userId: userId,
		phone: phone,
		card_id: card_id,
    location: location,
    date: date,
    expiration: expiration,
		passport_id: passport_id,
		firstName: firstName,
		lastName: lastName,
		gender: gender,
		dob: dob,
		birthPlace: birthPlace,
		hometown: hometown,
		residence: residence,
    accommodation: accommodation,
		religion: religion,
		ethic: ethic,
		profession: profession,
		workplace: workplace,
		education: education,
    moveInDate: moveInDate,
    moveInReason: moveInReason,
    moveOutDate: moveOutDate,
    moveOutReason: moveOutReason
	});

	res.status(200).json({
		responseStatus: 1,
		message: 'User updated!',
		data: {
			user: updatedUser,
		},
	});
};

exports.updatePassword = async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;
	const userId = req.params.userId;

	const updatedUser = await userService.updateUserPassword({
		userId: userId,
		oldPassword: oldPassword,
		newPassword: newPassword,
	});

	client.messages
		.create({
			to: '+84584702251', //? for test, replace with:
			// to: "+84" + newUser.phone.slice(1)
			body: `User: ${updatedUser.name}.\n
            Password updated successfully!`,
			from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
		})
		.then((message) => {
			// console.log(message.sid);
		})
		.catch((err) => {
			console.error(err);
		})
		.done();

	res.status(200).json({
		responseStatus: 1,
		message: 'Password updated successfully!',
	});
};

exports.userList = async (req, res, next) => {
	const list = await userService.getAllUsers();
	res.status(200).json({
		responseStatus: 1,
		message: 'All users fetched!',
		data: {
			list: list,
		},
	});
};

exports.deleteAccount = async (req, res, next) => {
	const userId = req.params.userId;
	await userService.deleteUserAccount({ userId: userId });

	res.status(200).json({
		responseStatus: 1,
		message: 'User and citizen attached to are deleted!',
	});
};
