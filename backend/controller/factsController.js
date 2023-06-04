const factsService = require('../service/factsService');

async function getFacts(req, res){
  try {
    const {id} = req.params;
    const facts = await factsService.fetchCountryFacts(id); 
    res.status(200).json(facts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

moduls.exports = {getFacts}

