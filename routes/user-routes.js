var express = require('express');
const { getAllUSers, getUser, deleteUser, updateUser } = require('../controllers/user-controller');
const { authorize } = require('../middlewares/auth');
var router = express.Router();

router.get("/getAllUsers", getAllUSers);
router.get("/getUser/:userId", getUser);
router.delete("/deleteUser/:userId", deleteUser);
router.patch("/updateUser/:userId", updateUser);

module.exports = { userRoutes: router }