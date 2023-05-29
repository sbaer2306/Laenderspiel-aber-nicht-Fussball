const geoService = require('../service/geoService');

async function getOsmData(req, res){
    try{
      const gameID = req.params;
      //Countryname needed;
      const countryName = req.query;
      const osmData = await geoService.fetchOsmData(countryName);
      res.json(osmData);
    }catch(error){
        console.error('Fehler beim Abrufen der OSM-Daten', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
}

moduls.exports = {getOsmData}