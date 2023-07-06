const express = require('express')
const gameRoutes = express.Router()
const geoController = require('../controller/geoController')
const gameController = require('../controller/gameController');
const factsController = require('../controller/factsController');
const ratingController = require('../controller/ratingController');
const sightsController = require('../controller/sightsController');
const passport = require('passport');
const {checkSessionTTL} = require('../service/sessionService')
const Redis = require('ioredis');

gameRoutes.get('/:id',passport.authenticate('jwt', { session: false }), gameController.getGame);
gameRoutes.delete('/:id',passport.authenticate('jwt', { session: false }), gameController.deleteGame);

gameRoutes.post('/',passport.authenticate('jwt', { session: false }), gameController.createGame);

//Facts
gameRoutes.get('/:id/facts',passport.authenticate('jwt', { session: false }), factsController.getFacts);

gameRoutes.post('/:id/rating/facts',passport.authenticate('jwt', { session: false }), ratingController.calculateRatingFacts);

//Geo-Information
gameRoutes.get('/:id/geo-information',passport.authenticate('jwt', { session: false }), geoController.getOsmData);
gameRoutes.post('/:id/rating/geo-information',passport.authenticate('jwt', { session: false }), ratingController.calculateDistance);

//Sights
gameRoutes.get('/:id/sights',passport.authenticate('jwt', { session: false }), sightsController.getSights);
gameRoutes.post('/:id/rating/sights',passport.authenticate('jwt', { session: false }), ratingController.calculateRatingSights);

//Export router
module.exports = gameRoutes;


