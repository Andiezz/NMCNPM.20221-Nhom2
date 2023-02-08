const CustomError = require('./custom-error.js');

class BadRequestError extends CustomError {
  statusCode = 400;
  responseCode = -600;
  constructor(message) {
    super(message);
  }

  serializeErrors() {
    return {
      response_status: this.responseCode,
      error: [{ message: this.message }],
    };
  }
}

module.exports = BadRequestError;
