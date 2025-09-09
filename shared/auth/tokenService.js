const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const config = require("../config");
const logger = require("../logger");

class TokenService {
  constructor() {}
  verify(token, secret) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new UnauthenticatedError("Invalid or expired token");
    }
  }
  verifyRefreshToken = (token) => {
    return this.verify(token, config.jwt.refresh);
  };
  verifyAccessToken = (token) => {
    return this.verify(token, config.jwt.access);
  };

  generate(payload, secret, expiresIn) {
    try {
      const token = jwt.sign(payload, secret, { expiresIn });
      return token;
    } catch (error) {
        logger.warn("Token Service Error", error.message)
        throw Error(error.message)
    }
  }

  generateRefreshToken(payload) {
    const secret = config.jwt.refresh;
      const expiresIn = "2h"; //config.jwt.refresh_expiry;
    return this.generate(payload, secret, expiresIn);
  }
  generateAccessToken(payload) {
    const secret = config.jwt.access;
    const expiresIn = config.jwt.access_expiry;
    return this.generate(payload, secret, expiresIn);
  }
}

module.exports = new TokenService();
