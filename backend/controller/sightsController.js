const sightsService = require('../service/sightsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getSights(req, res) {
    try {
        
        //ID from url
        const {id} = req.params;
    
        //Game from session
        const game = req.session.game;
        const userID = game.user_id;
    
        if(!game){
          return res.status(404).json({error: "Game not found", game: game, id: id});
        }
        if(userID !== req.user.id) return res.status(403).json({error: "Forbidden. User is not player of the game."});
    
        const country_id = Number(game.country_id);
        const country = await prismaClient.country.findUnique({
          where: {
            id: country_id,
          },
        })
        
        const countryCode = country.countryCode;
        
        const sights = await sightsService.fetchRandomCities(countryCode); 
        res.status(200).json(sights);
      } catch (error) {
          res.status(500).json({ error: error.message});
      }
}

module.exports = { getSights };