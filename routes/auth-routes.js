var express = require('express')
const { addUser, login, logout } = require('../controllers/user-controller');
const { passport, failureResponse, backChannelLogout } = require('../controllers/auth-controller');
const { authorize } = require('../middlewares/auth');

var router = express.Router();
if (process.env['APP_AUTH_TYPE'] == 'local') {
    router.post("/signup", addUser);
    router.post("/login", login);
    router.get("/logout", authorize, logout);
}
if (process.env['APP_AUTH_TYPE'] == 'oidc') {
    const { oidc } = require('../lib/oidc');
    router.get('/oidc', passport.authenticate('openidconnect'));

    router.get('/oidc/redirect', passport.authenticate('openidconnect', {
        successReturnToOrRedirect: oidc.successReturnToOrRedirect,
        failureRedirect: oidc.failureRedirect
    }));

    router.get('/oidc/failure', failureResponse);
    router.post('/oidc/backChannelLogout', backChannelLogout);
}

module.exports = { authToutes: router }