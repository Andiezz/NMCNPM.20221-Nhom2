const bcrypt = require('bcryptjs');
require('dotenv').config();

const hashPassword = require('../utils/security');

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
    passport_id,
    firstName,
    lastName,
    gender,
    dob,
    birthPlace,
    hometown,
    residence,
    religion,
    ethic,
    profession,
    workplace,
    education,
  } = req.body;
  if (!role) {
    const err = new Error('Role is required!');
    err.statusCode = 422;
    throw err;
  }

  const check_user = await User.findOne({
    phone: phone,
    role: role,
  });

  if (check_user) {
    const err = new Error('This account has already existed!');
    err.statusCode = 400;
    throw err;
  }

  const check_citizen = await Citizen.findOne({
    card_id: card_id,
    passport_id: passport_id,
  });

  if (check_citizen) {
    const err = new Error('This citizen has already existed!');
    err.statusCode = 400;
    throw err;
  }

  const citizen = new Citizen({
    card_id: card_id,
    passport_id: passport_id,
    name: {
      firstName: firstName,
      lastName: lastName,
    },
    gender: gender,
    dob: dob,
    birthPlace: birthPlace,
    hometown: hometown,
    residence: residence,
    religion: religion,
    ethic: ethic,
    profession: profession,
    workplace: workplace,
    education: education,
  });

  const newCitizen = await citizen.save();
  if (newCitizen !== citizen) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    citizen_id: newCitizen._id,
    role: role,
    phone: phone,
    password: hashedPassword,
  });

  const newUser = await user.save();
  if (newUser !== user) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  client.messages
    .create({
      to: '+84584702251', //? for test, replace with:
      // to: "+84" + newUser.phone.slice(1)
      body: 'An account with this phone number has registered successfully!',
      from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
    })
    .then((message) => {
      console.log(message.sid);
    })
    .done();

  res.status(200).json({
    responseStatus: 1,
    message: 'New user and citizen created!',
    data: {
      user: newUser,
      citizen: newCitizen,
    },
  });
};

exports.profile = async (req, res, next) => {
  const userId = req.params.userId;
  const check_user = await User.findById(userId);
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
    passport_id,
    firstName,
    lastName,
    gender,
    dob,
    birthPlace,
    hometown,
    residence,
    religion,
    ethic,
    profession,
    workplace,
    education,
  } = req.body;
  const userId = req.params.userId;
  const check_user = await User.findById(userId);

  if (!check_user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  //? can replace with validator
  const check_citizen = await Citizen.findById(check_user.citizen_id);
  const check_cardId = Citizen.findOne({
    card_id: card_id,
  });
  const check_passportId = Citizen.findOne({
    passport_id: passport_id,
  });

  if (check_cardId && check_cardId.citizen_id != check_citizen.citizen_id) {
    const err = new Error('This card identity has already been used.');
    err.statusCode = 400;
    throw err;
  }

  if (
    check_passportId &&
    check_passportId.citizen_id != check_citizen.citizen_id
  ) {
    const err = new Error('This passport identity has already been used.');
    err.statusCode = 400;
    throw err;
  }

  const check_phone = await User.findOne({
    phone: phone,
    role: check_user.role,
  });

  if (check_phone && phone != check_phone.phone) {
    const err = new Error('This phone has already been used.');
    err.statusCode = 400;
    throw err;
  }

  check_user.phone = phone;
  check_user.card_id = card_id;
  check_user.passport_id = passport_id;
  check_user.firstName = firstName;
  check_user.lastName = lastName;
  check_user.gender = gender;
  check_user.dob = dob;
  check_user.birthPlace = birthPlace;
  check_user.hometown = hometown;
  check_user.residence = residence;
  check_user.religion = religion;
  check_user.ethic = ethic;
  check_user.profession = profession;
  check_user.workplace = workplace;
  check_user.education = education;

  await check_user.save();
  res.status(200).json({
    responseStatus: 1,
    message: 'User updated!',
    data: {
      user: check_user,
    },
  });
};

exports.updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.userId;
  const check_user = await User.findById(userId);
  if (!check_user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  const isEqual = await bcrypt.compare(oldPassword, check_user.password);
  if (!isEqual) {
    const err = new Error('Old password is incorrect.');
    err.statusCode = 401;
    throw err;
  }
  const hashedPassword = await hashPassword(password);
  check_user.password = hashedPassword;
  await check_user.save();

  client.messages
    .create({
      to: '+84584702251', //? for test, replace with:
      // to: "+84" + newUser.phone.slice(1)
      body: 'Password updated successfully!',
      from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
    })
    .then((message) => {
      console.log(message.sid);
    })
    .done();

  res.status(200).json({
    responseStatus: 1,
    message: 'Password updated successfully!',
  });
};

exports.userList = async (req, res, next) => {
  const list = await User.find();
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
  await User.deleteOne({ _id: userId });
  res.status(200).json({
    responseStatus: 1,
    message: 'User deleted!',
  });
};
