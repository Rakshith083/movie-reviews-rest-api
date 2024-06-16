const { logger } = require('../lib/logger');
const moviesData = require('../data/movies.json');
async function dataLoad() {
    await loadMovies();
    await loadReviews();
}

async function loadMovies() {
    const { MovieModel } = require('../models/movie-model');
    try {
        await MovieModel.count().then(async (count) => {
            if (count == 0) {
                logger.info("Inserting movies data");
                await MovieModel.bulkCreate(moviesData);
            }
        })
    } catch (error) {
        logger.error(error)
    }
}

async function loadReviews() {
    const { ReviewsModel } = require('../models/reviews-model');
    const reviewData = require('../data/reviews.json');
    reviewData.forEach(item => item.likes = Math.floor(Math.random() * 10000))
    const { Op } = require('sequelize');
    try {
        const count = await ReviewsModel.count({ where: { movieId: { [Op.in]: moviesData.map(item => item.id) } } });
        if (count == 0) {
            logger.info("Inserting reviews data");
            await ReviewsModel.bulkCreate(reviewData)
        }
    } catch (error) {
        logger.error(error)
    }
}

module.exports = { dataLoad };