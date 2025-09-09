const { mongoose } = require("../../shared/db");
const { otp_expiry } = require("../../shared/config");
const generateCode = require("../serrvice/generateCode");

const OtpSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
    unique: true,
  },
  code: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  used: {
    type: Boolean,
    default: false,
  },
  otp_type: {
    type: String,
    enum: ["verify", "reset"],
    default: "verify",
  },
});

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: otp_expiry });

OtpSchema.pre("save", async function (next) {
  if (!this.isModified("used")) {
    try {
      this.code = await generateCode();
      next();
    } catch (error) {
      next(error);
    }
  }
});

module.exports = mongoose.model("Otp", OtpSchema, "otps");
