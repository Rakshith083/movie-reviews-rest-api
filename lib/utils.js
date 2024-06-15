
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
function getSignedToken(user) {
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: Number(process.env.SESSION_TIMEOUT) });
    return token;
}

module.exports = { getSignedToken };