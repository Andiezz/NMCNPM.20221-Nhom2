require('dotenv').config();

const {
  ThirdPartyError,
  DataNotFoundError,
  BadRequestError,
} = require('../utils/error');

const userService = require('../services/user');
const citizenService = require('../services/citizen');
const cardIdentityService = require('../services/cartIdentity');
const smsService = require('../services/sms');

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
  const newCitizen = await citizenService.createCitizen({
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
    moveOutReason: moveOutReason,
    modifiedBy: req.user._id,
  });

  const newCardIdentity = await cardIdentityService.createCardIdentity({
    card_id: card_id,
    citizen_id: newCitizen._id,
    location: location,
    date: date,
    expiration: expiration,
  });

  const newUser = await userService.createNewUser({
    role: role,
    phone: phone,
    password: password,
    citizen_id: newCitizen._id,
  });

  // await smsService.sendSMS({ phone: phone, message: message });

  res.status(200).json({
    responseStatus: 1,
    message: 'New user and citizen created!',
    data: {
      user: newUser,
      citizen: newCitizen,
      CardIdentity: newCardIdentity,
    },
  });
};

exports.createUser = async (req, res, next) => {
  const { role, phone, password } = req.body;

  const user = await userService.createNewUser({
    role: role,
    phone: phone,
    password: password,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'User created!',
    data: {
      user: user,
    },
  });
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  const check_user = await userService.getUserById({ userId });
  if (!check_user) {
    throw new DataNotFoundError('User not found');
  }
  res.status(200).json({
    responseStatus: 1,
    message: 'User fetched!',
    data: {
      user: check_user,
    },
  });
};

exports.updateUser = async (req, res, next) => {
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
    moveOutReason,
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
    moveOutReason: moveOutReason,
    modifiedBy: req.user.userId,
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

  await userService.updateUserPassword({
    userId: userId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });

  // await smsService.sendSMS({ phone: phone, message: message });

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
    message: 'User deleted!',
  });
};
