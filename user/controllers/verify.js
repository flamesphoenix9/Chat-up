const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Otp = require("../models/otp");
const { BadRequestError } = require("../../shared/errors");

const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    const existingUser = await User.findOne( { email })

    if (!existingUser) {
        throw new BadRequestError("User doesn't exist, create an account ")
    }
    if (existingUser.verified) {
        throw new BadRequestError("User is verified")
    }
   const otp=  await Otp.findOneAndUpdate(
  { userId:existingUser.userId, code, used: false }, 
  { $set: { used: true } },
  { new: true }
    );

    if (!otp) {
        throw new BadRequestError("Otp invalid")
    }

    existingUser.verified = true
    await existingUser.save();
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Account verified.",
      });
}
module.exports = verifyEmail