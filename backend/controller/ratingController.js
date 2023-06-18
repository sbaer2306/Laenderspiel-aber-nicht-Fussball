const geoService = require('../service/geoService');
const factsService = require('../service/factsService');
const scoringService = require('../service/scoringService')
const sightsService = require('../service/sightsService');

async function calculateRatingFacts(req, res){
  const {id} = req.params;
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

    const score = await scoringService.calculateRatingFacts(facts, data);

    game.total_score = score;
    game.current_round = 2;
    const country_name = game.country_name;
    req.session.game = game;
    req.session.facts = facts;

    
    const links = {
      nextStep: {
        description: 'Link for next round with id of game ',
        operationRef: `/game/geo-information`,   
        parameters: {
          id: id,
          country_name: country_name
        }
      }
    }

    res.status(200).json({ score, links });
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

    if(!game) return res.status(404).json({error: "Game not found"})
    

    const guessed_position = req.body.guessed_position;
    const center = req.body.center;
    const time = req.body.time;

    let distance = geoService.calculateDistance(guessed_position, center);

    let score = scoringService.calculateGeoInformation(distance, time) + game.total_score;
    game.total_score = score;
    
    game.current_round = 3;
    req.session.game = game;
   
    const links = {
      nextStep: {
        description: 'Link for next round with id of game and the center of the country',
        operationRef: `/game/sights`,   
        parameters: {
          id: id,
          center: center
        }
      }
    }

    res.status(200).json( {distance: distance, score: score, links: links})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

async function calculateRatingSights(req, res) {
  try {
    const {id} = req.params;
    const game = req.session.game;

    if(!game){
      return res.status(404).json({error: "Game not found", game: game, id: id})
    }

    const data = req.body;

    const score = await scoringService.calculateRatingSights(data);

    req.session.game = game;

    res.status(200).json( { score: score } );
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance, calculateRatingSights}

