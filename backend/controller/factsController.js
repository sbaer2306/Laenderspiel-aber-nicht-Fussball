const factsService = require('../service/factsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getFacts(req, res){
  try {
    //ID from url
    const {id} = req.params;

    //Game from session
    const game = req.session.game;

    if(!game || game.id !== Number(id)){
      return res.status(404).json({error: "Game not found", game: game, id: id})
    }

    const country_id = Number(game.country_id);
    const country = await prismaClient.country.findUnique({
      where: {
        id: country_id,
      },
    })
    const countryCode = country.countryCode;
    const facts = await factsService.fetchCountryFacts(countryCode); 
    res.status(200).json({facts: facts, country: country, countryCode: countryCode, countryId: country_id});
  } catch (error) {
      res.status(500).json({ error: error.message});
  }
}

module.exports = {getFacts}

