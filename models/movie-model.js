const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const MovieModel = sequelize.define('movies', {
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
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Kannada', 'Hindi', 'English', "Telugu", "Tamil", "Malayalam"]],
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: 240,
            min: 30
        }
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Horror', 'Action', 'Drama', "Suspense", "Thriller", "Adventure", "Animation", "Fantasy"]],
        }
    },
    storyline: DataTypes.STRING,
});
module.exports = { MovieModel };