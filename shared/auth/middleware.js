const TokenService = require("./tokenService");
const { UnauthenticatedError } = require("../errors")

const authMiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization;
    const check = authToken && authToken.startsWith("Bearer");
    if (!check) {
        throw new UnauthenticatedError("Token does not exist")
    }
    const token = authToken.split(" ")[1];
    if (!token) {
        throw new UnauthenticatedError("Token does not exist")
    }
    try {
        const decoded = TokenService.verifyAccessToken(token)
        // check user
        req.user = decoded;
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = authMiddleware;