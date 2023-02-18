const { validationResult } = require('express-validator');
const RequestValidationError = require('../errors/request-validation-error');
const CustomError = require('../errors/custom-error');

exports.tryCatch = (f) => async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    await f(req, res, next);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  if (error instanceof CustomError) {
    return res.status(status).json(error.serializeErrors());
  }
  console.log(error);
  return res.status(500).json({
    response_status: -600,
    errors: [{ message: 'Something went wrong' }],
  });
};
