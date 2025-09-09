const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Otp = require("../models/otp");
const redisService = require("../../shared/redis");
const { BadRequestError } = require("../../shared/errors");

const getResetOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  const otp = await Otp.create({ userId: user.userId, otp_type: "reset" });

// ENQUEUE MAIL
  await redisService.enqueuemail({
    to: user.email,
    verificationType: "reset",
    code: otp.code,
    type:"verification"
  })

  return res.status(StatusCodes.OK).json({
    success: true,
    code:otp.code,
    message:
      "OTP request successful. Please check your email for OTP verification.",
  });
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  const otp = await Otp.findOne({
    code,
    userId: user.userId,
    otp_type: "reset",
  });
  if (!otp) {
    throw new BadRequestError("Otp does not exist");
  }
  user.password = newPassword;
  await user.save();

  await redisService.enqueuemail({
    to: "phoenixzitherflames@gmail.com",  // user.email
    type:"resetSuccess"
  })
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Password reset successful.",
  });
};

module.exports = { getResetOTP, resetPassword };
