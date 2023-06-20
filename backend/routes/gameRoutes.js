const express = require('express')
const gameRoutes = express.Router()
const geoController = require('../controller/geoController')
const gameController = require('../controller/gameController');
const factsController = require('../controller/factsController');
const ratingController = require('../controller/ratingController');
const sightsController = require('../controller/sightsController');
const passport = require('passport');
const {checkSessionTTL} = require('../service/sessionService')


//middleware

gameRoutes.use((req,res,next) => {
    if(req.path !== '/' ) checkSessionTTL(req,res,next);
    else next();
}) 

//ROUTES
//Game


gameRoutes.get('/:id',passport.authenticate('jwt', { session: true }), gameController.getGame);
gameRoutes.delete('/:id',passport.authenticate('jwt', { session: true }), gameController.deleteGame);

gameRoutes.post('/',passport.authenticate('jwt', { session: true }), gameController.createGame);

//Facts
gameRoutes.get('/:id/facts',passport.authenticate('jwt', { session: true }), factsController.getFacts);

gameRoutes.post('/:id/rating/facts',passport.authenticate('jwt', { session: true }), ratingController.calculateRatingFacts);

//Geo-Information
gameRoutes.get('/:id/geo-information',passport.authenticate('jwt', { session: true }), geoController.getOsmData);
gameRoutes.post('/:id/rating/geo-information',passport.authenticate('jwt', { session: true }), ratingController.calculateDistance);

//Sights
gameRoutes.get('/:id/sights',passport.authenticate('jwt', { session: true }), sightsController.getSights);
gameRoutes.post('/:id/rating/sights',passport.authenticate('jwt', { session: true }), ratingController.calculateRatingSights);

//Export router
module.exports = gameRoutes;


