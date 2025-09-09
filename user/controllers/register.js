const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Otp = require("../models/otp");
const emailService = require("../../shared/email/emails")
const redisService = require("../../shared/redis");
const { BadRequestError } = require("../../shared/errors");

const register = async (req, res) => {
  const { username, email, password, firstname, lastname, date_of_birth } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new BadRequestError("Username or email already exists");
  }

  const user = await User.create({
    username,
    password,
    email,
    firstname,
    lastname,
    date_of_birth
  });
  // console.log(user)
  const otp = await Otp.create({ userId: user.userId, otp_type: "verify" });

  // Add signup mail to queue
  await redisService.enqueuemail({
    to: "phoenixzitherflames@gmail.com",  // user.email,
    code: otp.code,
    type: "signup",
  });


  return res.status(StatusCodes.OK).json({
    success: true,
    message: "User registered. Please check your email for OTP verification.",
    code:otp.code
  });
};

module.exports = register;
