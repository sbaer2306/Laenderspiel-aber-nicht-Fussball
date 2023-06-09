const factsService = require('../service/factsService');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function getFacts(req, res){
  try {
    const game = req.session.game;
    const country_id = game.country_id;
    const countryCode = prismaClient.country.findFirst({
      where: {
        id: country_id,
      }
    })
    const facts = await factsService.fetchCountryFacts(countryCode); 
    res.status(200).json(facts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {getFacts}

