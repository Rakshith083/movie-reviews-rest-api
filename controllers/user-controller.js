const { UserModel } = require('../models/user-model');
var bcrypt = require('bcryptjs');
const { getSignedToken } = require('./auth-controller');
const { logger } = require('../lib/logger');
const { AuthToken } = require('../models/auth-token');

const addUser = async (request, response, next) => {
    try {
        const user = await UserModel.create(request.body);
        const token = await getSignedToken(user);
        logger.info(user.username, "onboarded successfully");
        response.send({ user, token }).status(201);
    }
    catch (err) {
        console.log(err)
        response.status(422).send(err);
    }
}


const getAllUSers = async (req, res, next) => {
    try {
        const allUsers = await UserModel.findAll({ order: [['updatedAt', 'DESC']], attributes: { exclude: ['password'] }, });
        res.send(allUsers)
    } catch (err) {
        response.statusCode = 422;
        response.send(err);
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findByPk(req.params.userId);
        res.send(user)
    } catch (err) {
        throw err
    }
}

const deleteUser = async (req, res, next) => {
    try {
        var user = await findUser(req.params.userId);
        if (!user) {
            res.status({ status: 401 }).json({ message: 'User not found' })
        }
        await user.destroy();
        res.statusCode = 201;
        res.send('user deleted')
    } catch (err) {
        logger.error(err)
        throw err
    }
}

async function findUser(id) {
    try {
        const user = await UserModel.findByPk(id);
        return user
    } catch (err) {
        return err
    }
}
const updateUser = async function (req, res) {
    try {
        var user = await findUser(req.params.userId);
        await user.update(req.body, { where: { id: user.id } });
        res.statusCode = 201;
        res.send('user updated')
    } catch (err) {
        throw err
    }
}

const login = async (request, response) => {
    if (!(request.body.username || request.body.password)) {
        const error = new Error("username and password required");
        logger.error(error);
        throw error;
    }
    var user = await UserModel.findOne({ where: { username: request.body.username } });
    if (!user) {
        const error = new Error("User not found");
        logger.error(error);
        throw error;
    }
    if (!bcrypt.compareSync(request.body.password, user.password)) {
        const error = new Error("Invalid credentials");
        logger.error(error);
        response.send({ error: "Invalid credentials" }).status(422);
    }
    const token = await getSignedToken(user);
    user.update({ lastLogin: (new Date) })
    response.send({ user, token }).status(201);
}

const logout = async function (req, res) {
    try {
        AuthToken.findByPk(req.token).then(token => token.destroy());
        res.status(401).send({ msg: "Successfully logged out" });
    } catch (e) {
        logger.error(e);
        res.status(500).send(e);
    }
}

module.exports = { addUser, getAllUSers, getUser, deleteUser, updateUser, login, logout }