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



//middleware

/*gameRoutes.use((req,res,next) => {
    if(req.path !== '/' ) checkSessionTTL(req,res,next);
    else next();
})*/

//ROUTES
//Game

//TODO: REDIS-TEST entfernen

const redis = new Redis({
    host: 'redis-db',
    port: '6379',
    password: 'DieZeugenSeehofers2023',
    db: 0,
  });
  
gameRoutes.get('/testredis', async (req, res) =>{
    try {
        // Check if the data exists in Redis cache
        const cachedData = await redis.get('gameData');
    
        if (cachedData) {
          // If data exists in cache, return it
          return res.json({ message: 'Data retrieved from Redis cache', data: JSON.parse(cachedData) });
        } else {
          // If data does not exist in cache, fetch it from the database
          const gameData = await fetchGameDataFromDatabase();
    
          // Store the fetched data in Redis cache
          await redis.set('gameData', JSON.stringify(gameData));
    
          return res.json({ message: 'Data fetched from the database and stored in Redis', data: gameData });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
    
});
// Function to simulate fetching game data from the database
function fetchGameDataFromDatabase() {
    return new Promise((resolve, reject) => {
      // Simulating asynchronous database query
      setTimeout(() => {
        const gameData = { id: 1, name: 'Example Game' };
        resolve(gameData);
      }, 1000);
    });
}



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


