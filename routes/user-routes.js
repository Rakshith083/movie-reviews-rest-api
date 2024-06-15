var express = require('express')
const { addUser, getAllUSers, getUser, deleteUser, updateUser, getUserCounts, login } = require('../controllers/user-controller');
const { log_request } = require('../middlewares/auth');
var router = express.Router()

router.post("/signup", addUser);
router.post("/login", login);
router.get("/getAllUsers", getAllUSers);
router.get("/getUser/:userId", getUser);
router.delete("/deleteUser/:userId", deleteUser);
router.patch("/updateUser/:userId", updateUser);
router.get("/getUserCounts", log_request, getUserCounts);

module.exports = { userRoutes: router }