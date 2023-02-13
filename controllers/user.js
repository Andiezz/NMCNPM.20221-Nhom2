require('dotenv').config();

const {
  ThirdPartyError,
  DataNotFoundError,
  BadRequestError,
} = require('../utils/error');

const userService = require('../services/user');
const smsService = require('../services/sms');

exports.createUser = async (req, res, next) => {
  const { role, phone, password } = req.body;

  const user = await userService.createNewUser({
    role: role,
    phone: phone,
    password: password,
  });

  await smsService.sendSMS({ phone: phone, message: 'User created successfully' });

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
    role
  } = req.body;
  const userId = req.params.userId;

  const updatedUser = await userService.updateUser({
    userId: userId,
    phone: phone,
    role: role
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
