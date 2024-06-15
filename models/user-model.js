const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database')
const UserModel = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 150],
            notNull: {
                msg: "please provide name"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notNull: {
                msg: "please provide email"
            }
        }
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: [3, 50],
            notNull: {
                msg: "please provide username"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "please provide password"
            }
        }
    },
    lastLogin:{
        type:DataTypes.DATE
    }
});
module.exports = { UserModel }