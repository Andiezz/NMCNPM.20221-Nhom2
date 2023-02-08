const CustomError = require('./custom-error.js');

class ThirdPartyError extends CustomError {
  statusCode = 400;
  responseCode = -610;
  constructor() {
    super('Third Party Error');
  }

  serializeErrors() {
    return {
      response_status: this.responseCode,
      error: [{ message: 'Third Party Error' }],
    };
  }
}

module.exports = ThirdPartyError;
