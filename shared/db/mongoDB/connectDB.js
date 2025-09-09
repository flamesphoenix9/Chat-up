const mongoose = require("mongoose")
const config = require("../../config")
const logger = require("../../logger");

const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongo.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology:true
        });
        logger.info("MongoDB connected")

    } catch (error) {
        logger.error("Failed to connect to Mongo", error.message);
        process.exit(1);
  }
}
// Listen for connection errors
mongoose.connection.on("error", (err) => {
  logger.error("Mongoose connection error:", err);
  throw new Error("Mongoose Error");
});

// Listen for disconnects
// mongoose.connection.on("disconnected", () => {
//   logger.warn("MongoDB disconnected");
// });

module.exports = { connectMongoDB, mongoose };