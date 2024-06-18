var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');
var { oidc } = require('../lib/oidc');
const { AuthToken } = require('../models/auth-token');
const { logger } = require('../lib/logger');
var jwksClient = require('jwks-rsa');
var jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user-model');

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

    verifyOidcToken(accessToken, async function (err, decoded) {
        if (err)
            return cb(err);

        var user = await UserModel.findOne({ where: { email: profile.email } });
        if (!user) {
            user = await UserModel.create(profile);
        }
        user.sid = decoded.sid;
        profile.authToken = await getSignedToken(user);
        return cb(null, profile);
    });
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

const backChannelLogout = async (req, res) => {
    try {
        verifyOidcToken(req.body.logout_token, function (err, decoded) {
            if (err)
                return cb(err)
            AuthToken.destroy({ where: { sid: decoded.sid } })
            res.status(401).send({ msg: "Successfully loggedout" })
        });
    }
    catch (err) {
        logger.error(err)
        res.status(500).send(err)
    }
}

async function getSignedToken(user) {
    const jwt = require('jsonwebtoken');
    try {
        const jwtSecret = process.env.JWT_SECRET;
        const ttl = process.env.SESSION_TIMEOUT;
        const exp = new Date((new Date).getTime() + (ttl * 1000));
        const token = jwt.sign({ username: user.username, userId: user.id }, jwtSecret, { expiresIn: Number(process.env.SESSION_TIMEOUT) });
        const sid = user.sid || null;
        const authToken = await AuthToken.create({ token, userId: user.id, ttl, expiresAt: exp, sid });
        return authToken
    }
    catch (e) {
        logger.error(e)
    }
}

function verifyOidcToken(accessToken, cb) {
    var client = jwksClient({ jwksUri: oidc.jwksURL, timeout: 30000 });
    const decodedToken = jwt.decode(accessToken, { complete: true });
    const kid = decodedToken.header.kid;
    client.getSigningKey(kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        jwt.verify(accessToken, signingKey, {}, async function (err, decoded) {
            if (err) {
                logger.error(err);
                return cb(err)
            }
            return cb(null, decoded);
        });
    });
}

module.exports = { passport, failureResponse, getSignedToken, backChannelLogout };