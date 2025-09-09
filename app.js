require("module-alias/register");
const http = require("http");
const express = require("express");
const config = require("./shared/config");
const logger = require("./shared/logger");
const { connectMongoDB } = require("./shared/db");
const { ErrorHandler } = require("./shared/errors/");
const notFound = require("./not-found");
const authMiddleware = require("./shared/auth/middleware");
const { authRouter, userRouter } = require("./user/routes");

const app = express();
const { initSocket } = require("./sockets/socketManager");

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authMiddleware, userRouter);

app.use(notFound);
app.use(ErrorHandler);

const start = async () => {
  try {
    await connectMongoDB();
    const server = http.createServer(app);
    initSocket(server);
    server.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();