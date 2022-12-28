const User = require('../models/user');

exports.getUserByPhone = async ({ phone }) => {
  const user = await User.findOne({ phone: phone });
  return user;
};

exports.getUserByPhoneRole = async ({ phone, role }) => {
  const user = await User.findOne({ phone, role });
  return user;
};


