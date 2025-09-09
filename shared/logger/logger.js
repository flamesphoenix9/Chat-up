const { createLogger, transports, format, level } = require("winston")

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH-mm-ss" }),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "erroe" }),
        new transports.File({filename:"combined.log", })
    ]
})

module.exports = logger;