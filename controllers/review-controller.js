const { Op } = require('sequelize');
const { ReviewsModel } = require('../models/reviews-model');
const { MovieModel } = require('../models/movie-model');
const { logger } = require('../lib/logger');
const postReview = (req, res) => {
    try {
        if (!req.params.movieId) {
            throw new Error('Cannot post request');
        }
        ReviewsModel.count({ where: { [Op.and]: [{ movieId: req.params.movieId, userId: req.user.id }] } })
            .then((count) => {
                if (count) {
                    return res.status(422).send({ error: 'review already exist' });
                }
                req.body.movieId = req.params.movieId;
                req.body.userId = req.user.id;

                ReviewsModel.create(req.body).then((review) => {
                    res.status(201).send(review);
                });
            });

    } catch (e) {
        res.status(500).send(e);
    }
}

const getUserReviews = async (req, res) => {
    try {
        var reviews = await ReviewsModel.findAll({
            where: { userId: req.user.id }, include: [
                { model: MovieModel, attributes: ['id', 'name', 'releaseDate'] },
            ]
        });
        res.status(200).send(reviews);
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}

const editReview = async (req, res) => {
    try {
        const review = await ReviewsModel.findByPk(req.params.id);
        await review.update(req.body);
        res.send(review)
    } catch (e) {
        logger.error(e);
        res.status(500).send(e)
    }
}

const deleteReview = (req, res) => {
    try {
        ReviewsModel.findByPk(req.params.id).then(async (review) => {
            await review.destroy();
            res.send('review deleted')
        });
    } catch (e) {
        logger.error(e);
        res.status(500).send(e)
    }

}

module.exports = { postReview, getUserReviews, editReview, deleteReview };