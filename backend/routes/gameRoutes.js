const express = require('express')
const router = express.Router()
const geoController = require('../controller/geoController')
const gameController = require('../controller/gameController');
const factsController = require('../controller/factsController');
const ratingController = require('../controller/ratingController');

//ROUTES
//Game
router.use('/game', (req, res, next) => {
    //middleware logic
    next();

    //Game Routes
    router.get(':id', gameController.getGame);
    router.delete('/:id', gameController.deleteGame);
    router.post('/', gameController.createGame);
    
    //Facts
    router.get('/:id/facts', factsController.getFacts);
    
    router.post('/:id/rating/facts', ratingController.calculateRatingFacts);
    
    //Geo-Information
    router.get('/:game_id/geo-information', geoController.getOsmData);
})



//Export router
module.exports = router;