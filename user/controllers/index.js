const register = require("./register");
const verifyEmail = require("./verify")
const { resetPassword, getResetOTP } = require("./resetPassword")
const login = require("./login");

const {changeDetails, changePassword}= require("./patchUser")

module.exports = {
    register,
    verifyEmail,
    resetPassword,
    getResetOTP,
    login,
    changeDetails,
    changePassword
}