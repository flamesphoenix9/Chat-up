const { StatusCodes } = require("http-status-codes");
const CustomError = require("./Error");

class UnauthenticatedError extends CustomError {
  constructor(message = "Unauthenticated") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthenticatedError;