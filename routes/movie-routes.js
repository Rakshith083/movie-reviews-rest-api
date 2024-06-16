var express = require('express');
var router = express.Router();
const { getAllMovies, getMovie, deleteMovie, updateMovie, postMovie } = require('../controllers/movie-controller');
const { authorize } = require('../middlewares/auth');

router.get('/getAllMovies', authorize,getAllMovies);
router.get('/getMovie/:id', getMovie);
router.post('/postMovie', postMovie);
router.patch('/updateMovie/:id', updateMovie);
router.delete('/deleteMovie/:id', deleteMovie);

module.exports = { movieRoutes: router }