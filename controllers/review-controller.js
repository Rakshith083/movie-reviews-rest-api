const { Op } = require('sequelize');
const { ReviewsModel } = require('../models/reviews-model')
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

module.exports = { postReview };