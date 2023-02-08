const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('config');
require('dotenv').config();

const {
  NotAuthenticatedError,
  DataNotFoundError,
  BadRequestError,
} = require('../utils/error');

const authService = require('../services/auth');
const userService = require('../services/user');
const smsService = require('../services/sms');

exports.login = async (req, res, next) => {
  const { phone, password, role } = req.body;
  const check_user = await userService.getUserByPhoneRole({ phone, role });
  if (!check_user) {
    throw new DataNotFoundError('User not found');
  }

  const isEqual = await bcrypt.compare(password, check_user.password);
  if (!isEqual) {
    throw new NotAuthenticatedError('Wrong password.');
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
    throw new NotAuthenticatedError('Not authenticated.');
  }
  const access_token = await authService.getAccessToken(refresh_token);
  if (access_token) {
    req.session = { access_token };
    return res.status(200).json({
      response_status: 1,
      message: 'Refresh token successfully!',
    });
  } else {
    req.session = null;
    req.user = null;
    throw new BadRequestError('Invalid refresh token.');
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
    const token = await authService.genResetToken(buffer, user);

    await smsService.sendSMS({ phone: phone, message: token });

    res.status(200).json({
      response_status: 1,
      message: 'Reset token saved!',
    });
  });
};

exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);

  // await smsService.sendSMS({ phone: phone, message: message });

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
