var express = require('express')
const { addUser, login } = require('../controllers/user-controller');
var router = express.Router();
router.post("/signup", addUser);
router.post("/login", login);

module.exports = { authToutes: router }