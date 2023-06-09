const express = require('express')
const gameRoutes = express.Router()
const geoController = require('../controller/geoController')
const gameController = require('../controller/gameController');
const factsController = require('../controller/factsController');
const ratingController = require('../controller/ratingController');

//ROUTES
//Game


gameRoutes.get(':id', gameController.getGame);
gameRoutes.delete('/:id', gameController.deleteGame);

gameRoutes.post('/', gameController.createGame);

//Facts
gameRoutes.get('/:id/facts', factsController.getFacts);

gameRoutes.post('/:id/rating/facts', ratingController.calculateRatingFacts);

//Geo-Information
gameRoutes.get('/:id/geo-information', geoController.getOsmData);



//Export router
module.exports = gameRoutes;


