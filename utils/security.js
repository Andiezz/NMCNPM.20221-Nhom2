const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const signToken = async (user, secret, exp) => {
  return jwt.sign(user, secret, {
    expiresIn: exp,
  });
};

module.exports = {
  hashPassword,
  signToken,
};
