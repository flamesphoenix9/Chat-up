const logger = require("../logger")
const CustomError = require("./Error")

const ErrorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        logger.info("Custom Error", err.message)
        return res.status(err.statusCode).json({msg:err.message})
    }
    logger.error("Error occurred", err)
    const statuscode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    return res.status(statuscode).json({msg:message})
}


module.exports = ErrorHandler;