const geoService = require('../service/geoService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getOsmData(req, res){
    try{
      //ID from url
      const {id} = req.params;
      
      //Game from session
      const game = req.session.game;

      if(!game) return res.status(404).json({error: "Game not found"})
    

      const country = await prismaClient.country.findUnique({
        where: {
          id: Number(game.country_id),
        }
      })

      const osmData = await geoService.fetchOsmData(country.name);
      const center = geoService.getCenterOfCountry(osmData.elements[0].members);
      
      req.session.game = game;
      res.json({geometry: osmData, center: center});
    }catch(error){
        console.error('Fehler beim Abrufen der OSM-Daten', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
}

module.exports = {getOsmData}