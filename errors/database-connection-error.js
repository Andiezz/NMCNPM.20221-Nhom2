const CustomError = require('./custom-error.js');

class DatabaseConnectionError extends CustomError {
  statusCode = 502;
  responseCode = -602;
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

module.exports = DatabaseConnectionError;
