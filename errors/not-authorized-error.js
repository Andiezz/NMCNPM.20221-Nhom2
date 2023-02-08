const CustomError = require('./custom-error.js');

class NotAuthorizedError extends CustomError {
  statusCode = 403;
  responseCode = -603;
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

module.exports = NotAuthorizedError;
