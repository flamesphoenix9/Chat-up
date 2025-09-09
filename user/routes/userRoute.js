const express = require("express");
const Router = express.Router();

const {
    changeDetails,
    changePassword
} = require("../controllers/");


Router.route("/change-password").post(changePassword);
Router.route("/edit-profile").post(changeDetails);

module.exports = Router;