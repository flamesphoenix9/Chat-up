const { StatusCodes } = require("http-status-codes");
const CustomError = require("./Error");

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;