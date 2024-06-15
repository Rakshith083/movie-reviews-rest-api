const { UserModel } = require("../models/user-model");
const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).send('Authorization required');
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(403).send('Invalid or expired token');
            var user = await UserModel.findOne({ where: { username: decoded.username } });
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send(err);
    }
}

module.exports = { authorize }