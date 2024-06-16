var express = require('express')
const { addUser, login } = require('../controllers/user-controller');
const { passport, failureResponse } = require('../controllers/auth-controller');
const { oidc } = require('../lib/oidc');
var router = express.Router();
router.post("/signup", addUser);
router.post("/login", login);

router.get('/oidc', passport.authenticate('openidconnect'));

router.get('/oidc/redirect', passport.authenticate('openidconnect', {
    successReturnToOrRedirect: oidc.successReturnToOrRedirect,
    failureRedirect: oidc.failureRedirect
}));

router.get('/oidc/failure', failureResponse);

module.exports = { authToutes: router }