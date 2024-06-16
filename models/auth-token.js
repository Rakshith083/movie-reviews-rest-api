const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { UserModel } = require('./user-model');
const AuthToken = sequelize.define('authToken', {
    token: {
        type: DataTypes.TEXT,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    ttl: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    sid: DataTypes.STRING
});
UserModel.hasMany(AuthToken, { onDelete: 'CASCADE' });
AuthToken.belongsTo(UserModel);
module.exports = { AuthToken };