function log_request(req, res, next) {
    console.log("Inside middleware");
    next();
}

module.exports = { log_request }