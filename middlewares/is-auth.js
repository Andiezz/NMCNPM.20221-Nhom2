const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NotAuthenticatedError, NotAuthorizedError } = require('../utils/error');
const User = require('../models/user');

exports.authToken = (req, res, next) => {
  if (!req.get('Authorization')) {
    throw new NotAuthenticatedError('Not Authenticated');
  }
  const token = req.get('Authorization').split(' ')[1];
  let decoded_token = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        throw new NotAuthenticatedError('Not Authenticated');
      }
      req.user = user;
      next();
    }
  );
};

exports.authRole = (roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role) || req.user.status != 1) {
      return res.status(401).json({
        response_status: -603,
        message: 'Access Denied - Unauthorized',
      });
    }
    next();
  };
};
