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
    const data = req.body;
    console.log(data);
    res.status(200).json( {})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance}

