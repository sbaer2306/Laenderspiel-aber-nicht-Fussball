const axios = require('axios');

async function fetchCountryFacts(countryCode){  //f.e. VA = Vatican City, US = United States..
    try{
        const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;

        const response = await axios.get(url);
        console.log("Country Response:", response.data)

        const facts = {
          currencies: response.currencies,
          capital: response.capital,
          languages: response.languages,
          area: response.area,
          population: response.population,
          continents: response.continents,
        }

        return facts;
    }catch(error){
        console.error('Fehler bei der RestCountries Anfrage', error);
        throw error;
    }
}

module.exports = fetchCountryFacts;

/*

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