const bcrypt = require('bcryptjs');

const User = require('../models/user');

// const smsService = require('../services/sms');

const security = require('../utils/security');
const {
  DatabaseConnectionError,
  DataNotFoundError,
  BadRequestError,
} = require('../utils/error');

exports.getUserByPhone = async ({ phone }) => {
  const user = await User.findOne({ phone: phone });
  return user;
};

exports.getUserByPhoneRole = async ({ phone, role }) => {
  const user = await User.findOne({ phone, role });
  return user;
};

exports.getUserById = async ({ userId }) => {
  const user = await User.findById(userId, {
    password: 0,
    refresh_token: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return user;
};

exports.getAllUsers = async () => {
  const list = await User.find(
    {},
    {
      password: 0,
      refresh_token: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  );
  return list;
};

exports.createNewUser = async ({ role, phone, password  }) => {
  const hashedPassword = await security.hashPassword(password);

  const isExist = await User.exists({ phone: phone });
  if (isExist) {
    throw new BadRequestError('This phone has already been used.');
  }

  const user = new User({
    role: role,
    phone: phone,
    password: hashedPassword,
  });

  const newUser = await user.save();
  if (newUser !== user) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  // await smsService.verifyPhone();
  // await smsService.sendSMS({ phone: phone, message: 'User created successfully' });

  return newUser;
};

exports.updateUser = async ({ userId, phone, role }) => {
  const check_user = await User.findById(userId);

  if (check_user.role === 'ADMIN') {
    throw new BadRequestError('User is an admin.');
  }

  check_user.phone = phone;
  check_user.role = role;
  const updatedUser = await check_user.save();

  if (check_user !== updatedUser) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return updatedUser;
};

exports.updateUserPassword = async ({ userId, oldPassword, newPassword }) => {
  const check_user = await User.findById(userId);
  if (!check_user) {
    throw new DataNotFoundError('User not found.');
  }
  const isEqual = await bcrypt.compare(oldPassword, check_user.password);
  if (!isEqual) {
    const err = new BadRequestError('Old password is incorrect.');
    err.statusCode = 401;
    throw err;
  }
  const hashedPassword = await security.hashPassword(newPassword);
  check_user.password = hashedPassword;
  const updatedUser = await check_user.save();

  if (check_user !== updatedUser) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  // await smsService.sendSMS({ phone: check_user.phone, message: "Password updated successfully." });

  return updatedUser;
};

exports.deleteUserAccount = async ({ userId }) => {
  await User.deleteOne({ _id: userId });
};
