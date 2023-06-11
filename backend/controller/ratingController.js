const geoService = require('../service/geoService');

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



    res.status(200).json({ score });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
}

async function calculateDistance(req, res){
  try{
    const data = req.body;
    console.log(data);
    res.status(200).json( {})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance}

