const CustomError = require('./custom-error.js');

class ThirdPartyError extends CustomError {
	statusCode = 400;
	responseCode = -610;
	constructor() {
		super('Third Party Error');
	}

	serializeErrors() {
		return {
			response_code: this.responseCode,
			error: [{ message: 'Third Party Error' }],
		};
	}
}

module.exports = ThirdPartyError;
