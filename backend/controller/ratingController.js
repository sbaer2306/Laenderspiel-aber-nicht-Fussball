const geoService = require('../service/geoService');

async function calculateRatingFacts(req, res){
  try {
    const {data} = req.body;
    console.log("Data for rating: ", data);
    res.status(200).json({ score });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function calculateDistance(req, res){
  try{
    //ID from url
    const {id} = req.params;

    //Game from session
    const game = req.session.game;

    if(!game || game.id !== Number(id)){
      return res.status(404).json({error: "Game not found", game: game, id: id})
    }

    const positions = req.body;
    
    let distance = geoService.calculateDistance(positions.markerPosition, positions.center);

    req.session.game = game;
    res.status(200).json( {distance: distance})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance}

