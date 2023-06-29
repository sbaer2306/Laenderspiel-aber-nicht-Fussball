const factsService = require('../service/factsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getFacts(req, res){
  
  try {
    const userID = req.user.id;
    const {id} = req.params;
    const redisClient = req.redis;

    //Game from redis
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);
    console.log("game from facts:", game);
    console.log("code from country in facts:", game.country_code);
    if(!game) return res.status(404).json({error: "Game not found"})
    if( game.user_id !== userID){
      return res.status(403).json({error: "Forbidden. User is not player of the game.", game: game, user_id: userID})
    }

    const facts = await factsService.fetchCountryFacts(game.country_code); 

    
    res.status(200).json({facts: facts});
  } catch (error) {
      res.status(500).json({ error: error.message+" / getfacts"});
  }
}

module.exports = {getFacts}

