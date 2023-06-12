const geoService = require('../service/geoService');
const factsService = require('../service/factsService')

async function calculateRatingFacts(req, res){
  try {
    //auth or return here

    //get game from session
    const game = req.session.game;  
    //get facts from session
    const facts = req.session.facts;
    //get user-input from body
    //NEED TO BE: per Fact try's and overall time
    const {data} = req.body;



    const exampleData = {
      time: "60000", //100 sec to test
      currency: {
        answer: "euro", 
        tries: 2,
      },
      capital: {
        answer: "Berlin", 
        tries: 2,
      },
      language: {
        answer: "english", 
        tries: 3,
      },
      area: {
        answer: 3092390, 
        tries: 2,
      },
      continent: {
        answer: "europe", 
        tries: 1,
      },
      population: {
        answer: 79000000, 
        tries: 2,
      },
      country: {
        answer: "Germany", 
        tries: 1,
      },
      flag: true,
    }

    const score = factsService.calculateRatingFacts(facts, exampleData);

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
    
    let distance = geoService.calculateDistance(positions.guessed_position, positions.center);

    req.session.game = game;
    res.status(200).json( {distance: distance})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance}

