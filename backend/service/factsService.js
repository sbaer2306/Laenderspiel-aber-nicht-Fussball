const axios = require('axios');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

async function fetchCountryFacts(countryCode){  //f.e. VA = Vatican City, US = United States..
    try{
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

        const Facts = {
          country_name: factsData.name.official,
          facts: [
            {unMember: factsData.unMember},
            {currency: Object.values(factsData.currencies)[0].name},
            {capital: factsData.capital[0]},
            {language: Object.values(factsData.languages)[0]},
            {area: factsData.area},
            {continent: factsData.continents[0]},
            {population: factsData.population},
          ], 
          flags: flagResponses,
        }
        return Facts;
    }catch(error){
        return {error: error.message, data:"No facts retrieved", countryCode: countryCode};
    }
}

async function calculateRatingFacts(facts, guessedData){
  try{

  }catch(error){
    return {error: error.message, facts: facts, guessedData: guessedData};
  }
}

module.exports = {fetchCountryFacts, calculateRatingFacts};

/*



Facts:
      type: object
      properties:
        country_name:
          type: string
        facts:
          type: array
          items:
            $ref: '#/components/schemas/CountryFacts'
          minItems: 7
          maxItems: 7
        flags:
          type: array
          items:
            $ref: '#/components/schemas/FlagOption'
          minItems: 3
          maxItems: 3
  
    CountryFacts:
      type: object
      properties:
        question_keyword:
          type: string
        answer:
          type: string

    FlagOption:
      type: object
      properties:
        country_code:
          type: string
        flag_url:
          type: string
        correct_option:
          type: boolean




/* DATA

Facts
  Gründungsjahr  //KEINE DATEN 
  Kontinent
  Hauptstadt 
  Fläche
  Währung 
  Sprache
  Einwohner


*/