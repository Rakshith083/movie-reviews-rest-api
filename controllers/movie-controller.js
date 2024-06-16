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
            movie.dataValues.averageRating = 0;
            movie.dataValues.reviews = 0;
            if (ratingArray.length) {
                movie.dataValues.averageRating = (ratingArray.reduce((a, b) => a + b) / ratingArray.length).toFixed(2);
                movie.dataValues.reviews = ratingArray.length;
            }
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
                    attributes: ['id', 'rating', 'comment', 'updatedAt', 'likes'],
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

const deleteMovie = (req, res) => {
    try {
        MovieModel.findByPk(req.params.id).then((movie) => {
            movie.destroy();
            res.status(404).send("movie deleted")
        });
    }
    catch (e) {
        logger.error(e);
        res.status(500).send(e)
    }
}

const postMovie = (req, res) => {
    try {
        MovieModel.create(req.body).then((movie) => {
            res.status(201).send(movie)
        });
    }
    catch (e) {
        logger.error(e);
        res.status(500).send(e)
    }
}


const updateMovie = (req, res) => {
    try {
        MovieModel.findByPk(req.params.id).then(async (movie) => {
            await movie.update(req.body);
            res.send(movie)
        });
    }
    catch (e) {
        logger.error(e);
        res.status(500).send(e)
    }
}


module.exports = { getAllMovies, getMovie, deleteMovie, updateMovie, postMovie }