const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 604800}); //cache TTL 1 week

/**
 * Checks if countries have already been cached. Retrieves values from cache or from database and caches afterwards
 * @return {Object} Object of countires seperated into three arrays depending on difficulty
 */
const getCountries = async () => {
    //retrieve from cache
    let seperatedCountries = cache.get('seperatedCountries');
      
    //if not: retrieve db and cache
    if(!seperatedCountries){
        const countries = await prismaClient.country.findMany();

        seperatedCountries = {
            easy: [],
            medium: [],
            hard: [],
        };
        //split into three difficulty categories
        countries.forEach((country) => {
            const difficulty = country.difficultyMultiplier;
            if(difficulty <= 3) seperatedCountries.easy.push(country);
            if(difficulty > 3 && difficulty <= 7) seperatedCountries.medium.push(country);
            if(difficulty > 7) seperatedCountries.hard.push(country);
        })

        //cache for one week
        cache.set('seperatedCountries', seperatedCountries);
    }

    return seperatedCountries;
}

/**
 * Random picks country from array until a country which has not been played from user is returned.
 * @param {Array: Object} countriesByDifficulty   Array of country objects 
 * @return {Object} Object of countires seperated into three arrays depending on difficulty
 */
const getRandomCountryForDifficulty = async (countriesByDifficulty) => {
    let selectedCountry = null;
    while(!selectedCountry){
      const randomIndex = Math.floor(Math.random() * countriesByDifficulty.length)
      const randomCountry = countriesByDifficulty[randomIndex];
      const playedGame = await prismaClient.playedGame.findFirst({
        where: {
          userId: 3, //userId comes from middleware - please give it to me bastiiii :D
          countryId: randomCountry.id,
        }
      });

      if(!playedGame) selectedCountry = randomCountry;
    }
    return selectedCountry;
}


async function createGameInDatabase(redisClient, hashedUserId, userID, difficultyMultiplier, countryId, countryName)  {
    const game = {
        id: hashedUserId, 
        user_id: userID, 
        current_round: 1,
        max_rounds: 3,
        ttl: 900,
        created_at: new Date().toISOString(),
        difficulty: difficultyMultiplier,
        country_id: Number(countryId),
        country_name: countryName,
        total_score: 0,
      }
    return new Promise(async(resolve, reject) => {
      await redisClient.hset(game.id, 'games', JSON.stringify(game));
      resolve(game)
    });
}

module.exports = {getCountries, getRandomCountryForDifficulty, createGameInDatabase}

