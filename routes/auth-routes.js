var express = require('express')
const { addUser, login } = require('../controllers/user-controller');
const { passport, failureResponse } = require('../controllers/auth-controller');

var router = express.Router();
if (process.env['APP_AUTH_TYPE'] == 'local') {
    router.post("/signup", addUser);
    router.post("/login", login);
}
if (process.env['APP_AUTH_TYPE'] == 'oidc') {
    const { oidc } = require('../lib/oidc');
    router.get('/oidc', passport.authenticate('openidconnect'));

    router.get('/oidc/redirect', passport.authenticate('openidconnect', {
        successReturnToOrRedirect: oidc.successReturnToOrRedirect,
        failureRedirect: oidc.failureRedirect
    }));

    router.get('/oidc/failure', failureResponse);
}



module.exports = { authToutes: router }