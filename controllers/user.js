require('dotenv').config();

const userService = require('../services/user');
const citizenService = require('../services/citizen');
const security = require('../utils/security');

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
    card_id: card_id,
    passport_id: passport_id,
    firstName: firstName,
    lastName: lastName,
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

  const updatedUser = await userService.updateUserProfile({
    userId: userId,
    phone: phone,
    card_id: card_id,
    passport_id: passport_id,
    firstName: firstName,
    lastName: lastName,
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
  })
  
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
  
  const updatedUser = userService.updateUserPassword({
    userId: userId,
    oldPassword: oldPassword,
    newPassword: newPassword
  })

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
  await userService.deleteUserAccount({ userId: userId});

  res.status(200).json({
    responseStatus: 1,
    message: 'User and citizen attached to are deleted!',
  });
};
