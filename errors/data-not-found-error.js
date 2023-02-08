const CustomError = require('./custom-error.js');

class DataNotFoundError extends CustomError {
  statusCode = 404;
  responseCode = -604;
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

module.exports = DataNotFoundError;
