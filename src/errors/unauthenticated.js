const CustomAPIError = require('./custom-api-error');

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthenticatedError;