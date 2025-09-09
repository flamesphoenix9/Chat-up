const { StatusCodes } = require("http-status-codes");
const CustomError = require("./Error");

class notFoundError extends CustomError {
  constructor(message = "not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

module.exports = notFoundError;