var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');
var { oidc } = require('../lib/oidc');
const { AuthToken } = require('../models/auth-token');
const { logger } = require('../lib/logger');
passport.use(new OpenIDConnectStrategy({
    issuer: oidc.issuer,
    authorizationURL: oidc.authorizationURL,
    tokenURL: oidc.tokenURL,
    userInfoURL: oidc.userInfoURL,
    clientID: process.env['CLIENT_ID'],
    clientSecret: process.env['CLIENT_SECRET'],
    callbackURL: oidc.callbackURL,
    scope: ['profile']
}, function verify(issuer, profile, refreshToken, accessToken, cb) {
    profile = getOidcProfile(profile);

    return cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

function getOidcProfile(profile) {
    var userProfile = {
        id: profile.id,
        username: profile.username,
        name: profile.displayName || profile.name.givenName,
        email: profile.emails[0].value
    }
    return userProfile;
}

const failureResponse = (req, res) => {
    res.status(500).send({ "error": "Login Failed!" })
}

async function getSignedToken(user) {
    const jwt = require('jsonwebtoken');
    try {
        const jwtSecret = process.env.JWT_SECRET;
        const ttl = process.env.SESSION_TIMEOUT;
        const exp = new Date((new Date).getTime() + (ttl * 1000));
        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: Number(process.env.SESSION_TIMEOUT) });

        const authToken = await AuthToken.create({ token, userId: user.id, ttl, expiresAt: exp });
        return authToken.token
    }
    catch (e) {
        logger.error(e)
    }
}

module.exports = { passport, failureResponse, getSignedToken };