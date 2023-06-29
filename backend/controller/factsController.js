const factsService = require('../service/factsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getFacts(req, res){
  const userID = req.user.id;
  const gameID = req.params;
  const redisClient = req.redis;
  try {
    console.log("redisclient: ", redisClient);
    //Game from redis
    const game = await redisClient.hget(gameID, 'games');
    console.log("game from db: ", game);
    if(!game) return res.status(404).json({error: "Game not found"})
    if( game.user_id !== userID){
      return res.status(403).json({error: "Forbidden. User is not player of the game.", game: game, user_id: userID})
    }

    const country_id = Number(game.country_id);
    const country = await prismaClient.country.findUnique({
      where: {
        id: country_id,
      },
    })
    const countryCode = country.countryCode;
    const facts = await factsService.fetchCountryFacts(countryCode); 

    
    res.status(200).json({facts: facts, country: country, countryCode: countryCode, countryId: country_id});
  } catch (error) {
      res.status(500).json({ error: error.message+" / getfacts"});
  }
}

module.exports = {getFacts}

