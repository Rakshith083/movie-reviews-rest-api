const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { UserModel } = require('./user-model');
const { MovieModel } = require('./movie-model');
const ReviewsModel = sequelize.define('reviews', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 1000]
        }
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        }
    },
    likes: DataTypes.INTEGER
});

UserModel.hasMany(ReviewsModel, { foreignKey: "userId", onDelete: 'SET NULL' });
ReviewsModel.belongsTo(UserModel);
MovieModel.hasMany(ReviewsModel, { foreignKey: "movieId", onDelete: 'CASCADE' });
ReviewsModel.belongsTo(MovieModel);
module.exports = { ReviewsModel }