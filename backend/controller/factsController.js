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

    console.log("game from db: ", game);
    console.log("gameuser", game.user_id);
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

