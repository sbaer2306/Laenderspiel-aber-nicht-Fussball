const { PrismaClient } = require('@prisma/client');
const NodeCache = require('node-cache');

const prisma = new PrismaClient();
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
        const countries = await prisma.country.findMany();

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
      const playedGame = await prisma.playedGame.findFirst({
        where: {
          userId: userId, //userId comes from middleware - please give it to me bastiiii :D
          countryId: randomCountry.id,
        }
      });

      if(!playedGame) selectedCountry = randomCountry;
    }
    return selectedCountry;
}


module.exports = {getCountries, getRandomCountryForDifficulty}