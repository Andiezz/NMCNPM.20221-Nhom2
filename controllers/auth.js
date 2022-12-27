const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('config');
require('dotenv').config();
const security = require('../utils/security');

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const User = require('../models/user');

exports.login = async (req, res, next) => {
  const { phone, password, role } = req.body;

  const check_user = await User.findOne({
    phone: phone,
    role: role,
  });

  if (!check_user) {
    const err = new Error('Your phone or role is incorrect.');
    err.statusCode = 404;
    throw err;
  }

  const isEqual = bcrypt.compare(password, check_user.password);
  if (!isEqual) {
    const err = new Error('Wrong password.');
    err.statusCode = 401;
    throw err;
  }

  const user = {
    _id: check_user._id,
    role: check_user.role,
    status: check_user.status,
    citizen_id: check_user.citizen_id,
    phone: check_user.phone,
  };
  const access_token = await security.signToken(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    config.get('default.access_token_exp')
  );
  const refresh_token = await security.signToken(
    user,
    process.env.REFRESH_TOKEN_SECRET,
    60 * 60 * 24 * 90
  );
  check_user.refresh_token = refresh_token;
  await check_user.save();
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

  const check_user = await User.findOne({ refresh_token: refresh_token });
  if (!check_user) {
    req.session = null;
    req.user = null;
    const err = new Error('Refresh token not found.');
    err.statusCode = 404;
    throw err;
  }

  const user = {
    _id: check_user._id,
    role: check_user.role,
    status: check_user.status,
    citizen_id: check_user.citizen_id,
    phone: check_user.phone,
  };
  const access_token = await security.signToken(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    config.get('default.access_token_exp')
  );
  req.session = { access_token };

  return res.status(200).json({
    response_status: 1,
    message: 'Refresh token successfully!',
    data: {
      access_token,
    },
  });
};

exports.genResetToken = async (req, res, next) => {
  crypto.randomBytes(3, async (error, buffer) => {
    const { phone } = req.body;
    if (error) {
      error.statusCode = 400;
      throw error;
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ phone: phone });
    if (!user) {
      const err = new Error('Your phone or role is incorrect.');
      err.statusCode = 401;
      throw err;
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    user.save();

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
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    const error = new Error('Your reset token is expired or invalid.');
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await security.hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  user.save();

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
  const check_user = await User.findById(req.user._id);
  check_user.refresh_token = undefined;
  check_user.save();
  req.user = null;
  req.session = null;

  res.status(200).json({
    response_status: 1,
    message: 'Logout successfully!',
  });
};
