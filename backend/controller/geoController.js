const geoService = require('../service/geoService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

/**
 * Retrieves OSM data from the Overpass API based on the request.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
async function getOsmData(req, res){
  const {id} = req.params;
  const redisClient = req.redis;

  try{
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);

    if(!game) return res.status(404).json({error: "Game not found"});

    if(game.user_id !== req.user.id) return res.status(403).json({error: "Forbidden. User is not player of the game."});
  

    const country = await prismaClient.country.findUnique({
      where: {
        id: Number(game.country_id),
      }
    })

    const osmData = await geoService.fetchOsmData(country.name);
    const center = geoService.getCenterOfCountry(osmData.elements[0].members);
    
    game.country_center = center;
    await redisClient.hset(id, 'games', JSON.stringify(game));

    res.status(200).json({geometry: osmData, center: center});
  }catch(error){
      res.status(500).json({error: 'Internal server error'});
  }
}

module.exports = {getOsmData}