const { Server } = require("socket.io");
const { UnauthenticatedError } = require("../shared/errors");
const tokenService = require("../shared/auth/tokenService");
const ChatSocket = require("./chat.socket");
const logger = require("../shared/logger");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  // socket auth middleware 
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new UnauthenticatedError("Socket Error -- No token"));
    }

    try {
      const decoded = tokenService.verifyAccessToken(token);
      socket.user = {id:decoded.userId, username:decoded.username}
      next();
    } catch (err) {
      return next(new UnauthenticatedError("Socket Error -- Token Error"));
    }
  });

  // Handle new connections
  io.on("connection", (socket) => {
    logger.info(` User connected: ${socket.user?.id}`);
    
    new ChatSocket(io, socket); // now events are protected  

    socket.on("disconnect", () => {
      logger.warn(`User disconnected: ${socket.user?.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };