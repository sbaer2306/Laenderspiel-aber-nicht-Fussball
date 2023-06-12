const geoService = require('../service/geoService');
const factsService = require('../service/factsService')

async function calculateRatingFacts(req, res){
  try {
    //auth or return here
    //return res.status(403).json({message: "Forbidden"})
    //get game from session
    const game = req.session.game;  
    //if(!game) return res.status(404).json({message: "Game not found"})
    //get facts from session
    const facts = req.session.facts;
    //get user-input from body
    //NEED TO BE: per Fact try's and overall time
    const {data} = req.body;
    //return res.status(406).json({message: "Not acceptable"})

    const score = await factsService.calculateRatingFacts(facts, data);

    game.current_score = score;
    req.session.game = game;
    req.session.facts = facts;

    res.status(200).json({ score });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
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

