const express = require('express');
const movieController = require('../controller/movieController');
const ScoreController = require('../controller/scoreController');

//This is router file use to call different routers

const router = express.Router();

router.route('/getRecommendation').get(movieController.getRecommendation);
router.route('/getMovie').get(movieController.getMoives);
router.route('/getAllMovies').get(movieController.getAllMovies);

//exporting router
module.exports = router;
