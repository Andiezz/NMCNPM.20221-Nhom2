const config = require('config');
require('dotenv').config();

const User = require('../models/user');
const security = require('../utils/security');

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.signJWT = async ({ id, role, status, citizen_id, phone }) => {
  const user = {
    _id: id,
    role: role,
    status: status,
    citizen_id: citizen_id,
    phone: phone,
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
  await User.findByIdAndUpdate(id, { refresh_token }, { new: true });
  return {
    access_token,
    refresh_token,
    user,
  };
};

exports.getAccessToken = async (refresh_token) => {
  const checkRT = User.exists({ refresh_token: refresh_token });
  if (checkRT) {
    const user_info = await User.findOne({ refresh_token: refresh_token });
    const user = {
      _id: user_info._id,
      role: user_info.role,
      status: user_info.status,
      citizen_id: user_info.citizen_id,
      phone: user_info.phone,
    };

    const access_token = await security.signToken(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      config.get('default.access_token_exp')
    );
    return access_token;
  } else {
    return null;
  }
};

exports.genResetToken = async (buffer, user) => {
  const token = buffer.toString('hex');
  if (!user) {
    const err = new Error('Your phone is incorrect.');
    err.statusCode = 401;
    throw err;
  }
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();
  return token;
};

exports.resetPassword = async (token, newPassword) => {
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
  await user.save();
};

exports.logout = async (id) => {
  const user = await User.findById(id);
  user.refresh_token = undefined;
  await user.save();
};
