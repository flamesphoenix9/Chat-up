require("dotenv").config();
module.exports = {
  PORT: process.env.PORT,

  // OTP EXPIRY in mibutes
  otp_expiry: parseInt(process.env.OTP_EXPIRY) * 60 ^ 1000,
  
  // SESSION EXPIRY in days
  session_expiry: parseInt(process.env.SESSION_EXPIRY) * 24 * 60 * 60 * 1000,
  
  mongo: {
    MONGO_URI: process.env.MONGO_URI,
  },
  
  email: {
    service: process.env.service,
    user: process.env.USER,
    pass: process.env.EMAIL_PASS,
    sender: process.env.USER,
  },
  
   redis: {
    host: process.env.REDIS_HOST,  
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS,
    tls: false,
  },
  
  jwt: {
    access: process.env.JWT_ACCESS_SECRET,
    access_expiry: process.env.JWT_ACCESS_EXPIRES,
    refresh: process.env.JWT_REFRESH_SECRET,
    refresh_expiry: process.env.JWT_REFRESH_SECRET,
  },
  //ADD OTHER ENV VAR
};
