const express = require("express");
const router = express.Router();
const { postReview, getUserReviews, editReview ,deleteReview} = require('../controllers/review-controller');
const { authorize } = require("../middlewares/auth");

router.post('/postReview/:movieId', authorize, postReview);
router.get('/getUserReviews', authorize, getUserReviews);
router.patch('/editReview/:id', authorize, editReview);
router.delete('/deleteReview/:id', authorize, deleteReview);


module.exports = { reviewRoutes: router }