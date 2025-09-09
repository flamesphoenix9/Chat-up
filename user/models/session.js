const { mongoose } = require("../../shared/db");
const config = require("../../shared/config");
const tokenService = require("../../shared/auth/tokenService");
const logger = require("../../shared/logger");

const SessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
    unique: true,
  },
  isStaff: {
    type: Boolean,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: config.session_expiry }
);

// Generate refresh token before saving
SessionSchema.pre("save", async function (next) {
  try {
    await this.constructor.deleteMany({ userId: this.userId });
    next();
  } catch (error) {
    logger.warn("Session token error")
    next(error);
  }
});

module.exports = mongoose.model("Session", SessionSchema, "sessions");
