const geoService = require('../service/geoService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getOsmData(req, res){
    try{
      //ID from url
      const {id} = req.params;
      
      //Game from session
      const game = req.session.game;
      const userID = game.user_id;

      if(!game) return res.status(404).json({error: "Game not found"});

      if(userID !== req.user.id) return res.status(403).json({error: "Forbidden. User is not player of the game."});

      //console.log(req.user);
    

      const country = await prismaClient.country.findUnique({
        where: {
          id: Number(game.country_id),
        }
      })

      const osmData = await geoService.fetchOsmData(country.name);
      const center = geoService.getCenterOfCountry(osmData.elements[0].members);
      
      req.session.game = game;
      res.status(200).json({geometry: osmData, center: center});
    }catch(error){
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = {getOsmData}