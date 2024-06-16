const { Op } = require('sequelize');
const { AuthToken } = require('../models/auth-token');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user-model');

function authorize(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        var token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            if (req?.user?.authToken?.token) {
                token = req.user.authToken.token;
            }
            else {
                 return res.status(401).send({ error: 'Authorization required' }) 
                }
        };
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(403).send({ error: 'Invalid or expired token' });
            const authToken = await AuthToken.findOne({
                where: {
                    [Op.and]: [
                        { token },
                        { userId: decoded.userId },
                        { expiresAt: { [Op.gt]: (new Date) } }]
                },
                include: [
                    { model: UserModel, attributes: { exclude: ['password'] } }
                ]
            });
            if (!authToken) {
                return res.status(403).send({ error: 'Invalid or expired token' });
            }
            req.user = authToken.user;
            req.token = authToken.token;
            next();
        });
    } catch (err) {
        res.status(401).send(err);
    }
}

module.exports = { authorize }