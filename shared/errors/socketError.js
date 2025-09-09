const { StatusCodes } = require("http-status-codes");
const CustomError = require("./Error");

class ChatSocketError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, StatusCodes.EXPECTATION_FAILED);
  }
}

module.exports = ChatSocketError;