const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const redisService = require("../../shared/redis");
const { notFoundError } = require("../../shared/errors");

const changePassword = async (req, res) => {
    const { userId, email} = req.user;
    const { newPassword } = req.body;
    const user = await User.findOne({ userId })
    if (!user) {
        throw new notFoundError("User not found")
    }
    user.password = newPassword;
    await user.save()
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const time = today.toTimeString().split(" ")[0].slice(0, 5);

    await redisService.enqueuemail({
        to: email,
        message: {
            text: `Your password was changed at ${date, time}`,
            subject: "Password Change"
    }
    })

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password change successful",
    });
}

const changeDetails = async (req, res) => {
    const { userId} = req.user;
    const { lastname, firstname, date_of_birth } = req.body;
    
    const user = await User.findOne({ userId })
    if (!user) {
        throw new notFoundError("User not found")
    }
    if (firstname) {
        user.firstname = firstname
    }
    if (lastname) {
        user.lastname= lastname
    }
    if (date_of_birth) {
        user.date_of_birth= date_of_birth
    }
    await user.save()

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "User details change successful",
    });
}

module.exports = { changePassword, changeDetails };