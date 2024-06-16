var oidc = require('../config/oidc.json');
const oidc_internal_urls = {
    callbackURL: '/api/auth/oidc/redirect',
    successReturnToOrRedirect: "/api/movies/getAllMovies",
    failureRedirect: "/api/auth/oidc/failure"
}

module.exports = { oidc: Object.assign(oidc, oidc_internal_urls) }