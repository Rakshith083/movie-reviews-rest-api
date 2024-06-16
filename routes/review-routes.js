const express = require("express");
const router = express.Router();
const { postReview } = require('../controllers/review-controller');
const { authorize } = require("../middlewares/auth");
router.post('/postReview/:movieId', authorize, postReview);

module.exports = { reviewRoutes: router }