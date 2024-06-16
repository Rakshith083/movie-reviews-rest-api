const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
var bcrypt = require('bcryptjs');
const UserModel = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
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
        },
        set(value) {
            var salt = bcrypt.genSaltSync(10);
            value = bcrypt.hashSync(value, salt);
            this.setDataValue('password', value);
        }
    },
    lastLogin: {
        type: DataTypes.DATE
    }
});
module.exports = { UserModel }