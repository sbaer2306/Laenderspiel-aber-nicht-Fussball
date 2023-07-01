const sightsService = require('../service/sightsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();


/**
 * Retrieves the sights for each city and their coordinates for third round of game.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
async function getSights(req, res) {
    try {
        
        const userID = req.user.id;
        const {id} = req.params;
        const redisClient = req.redis;

        const gameString = await redisClient.hget(id, 'games');
        const game = JSON.parse(gameString);
        if(!game){
          return res.status(404).json({error: "Game not found", game: game, id: id});
        }
        if(game.user_id !== userID){
          return res.status(403).json({error: "Forbidden. User is not player of the game."});
        } 
        
        const sights = await sightsService.fetchRandomCities(game.country_code); 
        res.status(200).json(sights);
      } catch (error) {
          res.status(500).json({ error: error.message});
      }
}

module.exports = { getSights };