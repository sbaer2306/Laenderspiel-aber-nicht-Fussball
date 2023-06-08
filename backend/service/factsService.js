const axios = require('axios');

async function fetchCountryFacts(countryCode){  //f.e. VA = Vatican City, US = United States..
    try{
        const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;

        const response = await axios.get(url);
        console.log("Country Response:", response.data)


        const flagURL = `https://flagsapi.com/${countryCode}/shiny/64.png`;

        const response = await axios.get(flagURL);
        //RANDOMIZED TWO COUNTRY FLAGS DEPENDING ON COUNTRYCODE

        const Facts = {
          country_name: response.name.official,
          facts: [
            {unMember: response.unMember},
            {currency: Object.values(response.currencies)[0].name},
            {capital: response.capital},
            {language: Object.values(response.languages)[0]},
            {area: response.area},
            {continent: response.continents[0]},
            {population: response.population},
          ], 
          flags: [
            {},
            {},
            {},
          ],
        }
        return Facts;
    }catch(error){
        console.error('Fehler bei der RestCountries Anfrage', error);
        throw error;
    }
}

module.exports = {fetchCountryFacts};

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