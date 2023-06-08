const express = require('express')
const gameRouter = express.Router()
const geoController = require('../controller/geoController')
const gameController = require('../controller/gameController');
const factsController = require('../controller/factsController');
const ratingController = require('../controller/ratingController');

const gameMiddleware = require('../middleware/gameMiddleware');

//ROUTES
//Game

//Game Routes
gameRouter.get(':id', gameController.getGame);
gameRouter.delete('/:id', gameController.deleteGame);
gameRouter.post('/', gameController.createGame);

//Facts
gameRouter.get('/:id/facts',gameMiddleware.retrieveGameFromSession, factsController.getFacts);

gameRouter.post('/:id/rating/facts', gameMiddleware.saveGameToSession, ratingController.calculateRatingFacts);

//Geo-Information
gameRouter.get('/:game_id/geo-information', gameMiddleware.retrieveGameFromSession, geoController.getOsmData);



//Export router
module.exports = gameRouter;