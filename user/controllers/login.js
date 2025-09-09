const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Session = require("../models/session");
const tokenService = require("../../shared/auth/tokenService");
// const redisService = require("../../shared/redis");
const { notFoundError, UnauthenticatedError } = require("../../shared/errors");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.verified) {
    throw new notFoundError("User does not exist or user is not veified ");
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new UnauthenticatedError("Wrong password");
  }

  //GENERATE TOKEN
  const accessToken = tokenService.generateAccessToken({
    userId: user.userId,
    username: user.username,
    email: user.email,
    verified: user.verified,
    isStaff: user.isStaff,
    profile_picture: user.profile_picture
  });
  const refreshToken = tokenService.generateRefreshToken({
    userId: user.userId,
    verified: user.verified,
    isStaff: user.isStaff
  });

  // CREATE SESSION with refrsh token
  const session = await Session.create({
    userId: user.userId,
    isStaff: user.isStaff,
    token:refreshToken
  });
    
  res.status(StatusCodes.OK).json({
    success: true,
    accessToken,
    refreshToken: session.token,
    user: {
      id: user.userId,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
};

module.exports = login;
