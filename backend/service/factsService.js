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

        const urlFacts = `https://restcountries.com/v3.1/alpha/${countryCode}`;

        const responseFacts = await axios.get(urlFacts);
        const factsData = responseFacts.data[0];
        
        let countryCodes = [countryCode];

        const twentyRandomCountries = await prismaClient.country.findMany({
          where: {
            countryCode: {not: countryCode }
          },
          take: 20,
        });
        

        //randomize
        for (let i = twentyRandomCountries.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [twentyRandomCountries[i], twentyRandomCountries[j]] = [twentyRandomCountries[j], twentyRandomCountries[i]];
        }
        const twoCountries = twentyRandomCountries.splice(0,2)
        Object.values(twoCountries).map((country) => {
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
        // Shuffle again
        for (let i = flagResponses.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [flagResponses[i], flagResponses[j]] = [flagResponses[j], flagResponses[i]];
        }

        let borderCountryNames = "";
        if (factsData.borders && factsData.borders.length > 0) {
          const borderCodes = factsData.borders;
          const borderCountries = await Promise.all(
            borderCodes.map(async (code) => {
              const url = `https://restcountries.com/v3.1/alpha/${code}`;
              const res = await axios.get(url);
              return res.data[0].name.common;
            })
          );
          borderCountryNames = borderCountries.join(", ");
        } else {
          borderCountryNames = "none";
        }

        facts = {
          country_name: factsData.name.common,
          facts: [
            {question_keyword: "border countries", answer: borderCountryNames}, //comma seperated string
            {question_keyword: "currency", answer: Object.values(factsData.currencies)[0].name},
            {question_keyword: "capital", answer: factsData.capital[0]},
            {question_keyword: "language", answer: Object.values(factsData.languages)[0]},
            {question_keyword: "area", answer: factsData.area},
            {question_keyword: "continent", answer: factsData.continents[0]},
            {question_keyword: "population", answer: factsData.population},
          ], 
          flags: flagResponses,
        }

        return facts;
    }catch(error){
        return {error: error.message, data:"No facts retrieved", countryCode: countryCode};
    }
}

function getFactsFromCache(countryCode){
  let facts = cache.get(`${countryCode}-facts`);
  return facts;
}

module.exports = {fetchCountryFacts, getFactsFromCache};
