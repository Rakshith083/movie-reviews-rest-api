const { logger } = require('../lib/logger');
const { MovieModel } = require('../models/movie-model');
const { ReviewsModel } = require('../models/reviews-model');
const { UserModel } = require('../models/user-model');

const getAllMovies = async function (request, response) {
    try {
        const movies = await MovieModel.findAll(
            {
                include: [
                    {
                        model: ReviewsModel,
                        as: 'reviews',
                        attributes: ['rating']
                    }],
                order: [['releaseDate', "DESC"]],
            }
        );
        movies.forEach(movie => {
            const ratingArray = movie.reviews.map(item => item.rating);
            movie.dataValues.averageRating = (ratingArray.reduce((a, b) => a + b) / ratingArray.length).toFixed(2);
            movie.dataValues.reviews = ratingArray.length;
        });
        response.status(201).send(movies);
    } catch (err) {
        logger.error(err);
        response.status(500).send(err);
    }
}

const getMovie = async (req, res) => {
    try {
        var id = req.params.id;
        if (!id) {
            throw new Error('movie id missing')
        }

        const movie = await MovieModel.findOne({
            where: { id: id },
            include: [
                {
                    model: ReviewsModel,
                    as: 'reviews',
                    attributes: ['rating', 'comment', 'updatedAt', 'likes'],
                    include: [{ model: UserModel, attributes: ['name', 'username'] }]
                },
            ]
        });
        res.status(201).send(movie);
    }
    catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
}

module.exports = { getAllMovies, getMovie }