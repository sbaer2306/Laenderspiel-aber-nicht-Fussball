const axios = require('axios');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 604800}); //cache TTL 1 week

/**
 * Checks cache if data is already available and retrieves data, otherwise make API Call, cache and retrieves data
 * @param {String} countryCode f.e. VA = Vatican City, US = United States
 * @returns {Object} facts for Country and flag options
 */
async function fetchCountryFacts(countryCode){
    try{

        let facts = cache.get(`${countryCode}-facts`);
        if(facts) return facts;

        const urlFacts = `https://restcountries.com/v3.1/alpha/${countryCode}`;

        const responseFacts = await axios.get(urlFacts);
        const factsData = responseFacts.data[0];
        
        let countryCodes = [countryCode];

        const twoRandomCountries = await prismaClient.country.findMany({
          where: {
            countryCode: {not: countryCode }
          },
          take: 2,
        });
        Object.values(twoRandomCountries).map((country) => {
          countryCodes.push(country.countryCode)
        })

        let flagResponses = [];
        for (let i = 0; i < countryCodes.length; i++) {
          const countryCode = countryCodes[i];
          const urlFlag = `https://flagsapi.com/${countryCode}/shiny/64.png`;
          
          const correctOption = i === 0 ? true : false;
          
          const flag = {
            country_code: countryCode,
            flag_url: urlFlag,
            correct_option: correctOption
          };
          
          flagResponses.push(flag);
        }
        // Shuffle the flagResponses array using Fisher-Yates algorithm
        for (let i = flagResponses.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [flagResponses[i], flagResponses[j]] = [flagResponses[j], flagResponses[i]];
        }

        //get one 'waterbordering' country
        let borderCountryName = "";
        if(factsData.borders){
          const code = factsData.borders[0];
          const url = `https://restcountries.com/v3.1/alpha/${code}`;

          const res = await axios.get(url);
          borderCountryName = res.data[0].name.common;
        }else{
          borderCountryName = "none"
        }

        facts = {
          country_name: factsData.name.official,
          facts: [
            {border: borderCountryName}, 
            {currency: Object.values(factsData.currencies)[0].name},
            {capital: factsData.capital[0]},
            {language: Object.values(factsData.languages)[0]},
            {area: factsData.area},
            {continent: factsData.continents[0]},
            {population: factsData.population},
          ], 
          flags: flagResponses,
        }
        cache.set(`${countryCode}-facts`, facts);
        return facts;
    }catch(error){
        return {error: error.message, data:"No facts retrieved", countryCode: countryCode};
    }
}


module.exports = {fetchCountryFacts};
