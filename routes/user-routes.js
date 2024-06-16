var express = require('express')
const { addUser, getAllUSers, getUser, deleteUser, updateUser, getUserCounts, login } = require('../controllers/user-controller');
const { authorize } = require('../middlewares/auth');
var router = express.Router()

router.get("/getAllUsers", getAllUSers);
router.get("/getUser/:userId", getUser);
router.delete("/deleteUser/:userId", deleteUser);
router.patch("/updateUser/:userId", updateUser);
router.get("/getUserCounts", authorize, getUserCounts);

module.exports = { userRoutes: router }