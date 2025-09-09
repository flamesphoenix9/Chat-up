const CustomError = require("./Error");
const  notFoundError = require("./notFoundError")
const ErrorHandler = require("./middleware");
const UnauthenticatedError = require("./unauthenticated");
const BadRequestError = require("./badRequest");
const ChatSocketError = require("./socketError");

module.exports = {
    CustomError, notFoundError, ErrorHandler, BadRequestError,
    UnauthenticatedError, ChatSocketError
}