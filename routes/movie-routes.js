var express = require('express');
var router = express.Router();
const { getAllMovies, getMovie } = require('../controllers/movie-controller');

router.get('/getAllMovies', getAllMovies);
router.get('/getMovie/:id',getMovie);

module.exports = { movieRoutes: router }