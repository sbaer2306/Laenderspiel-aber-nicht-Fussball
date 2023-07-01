const axios = require('axios');

/**
* Converts degrees to radians.
* @param {number} degrees - The value in degrees.
* @returns {number} - The value converted to radians.
*/
function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
* Calculates the distance between two coordinates using the Haversine formula.
* @param {number} latitude - The latitude of the actual position.
* @param {number} longitude - The longitude of the actual position.
* @param {number} guessedLatitude - The latitude of the guessed position.
* @param {number} guessedLongitude - The longitude of the guessed position.
* @returns {number} - The calculated distance between the coordinates in kilometers.
*/
function calculateDistance(latitude, longitude, guessedLatitude, guessedlongitude) {
  
  const earthRadius = 6371;

  const latitudeRadius = degToRad(latitude);
  const longitudeRadius = degToRad(longitude);
  const guessedLatitudeRadius = degToRad(guessedLatitude);
  const guessedLongitudeRadius = degToRad(guessedlongitude);

  const latitudeDifference = guessedLatitudeRadius - latitudeRadius;
  const longitudeDifference = guessedLongitudeRadius - longitudeRadius;

  const a =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(latitudeRadius) *
    Math.cos(guessedLatitudeRadius) *
    Math.sin(longitudeDifference / 2) *
    Math.sin(longitudeDifference / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

return distance;

}

/**
* Fetches the top 10 cities with the highest population in the specified country.
* @param {string} countryCode - The country code (ISO 3166-1) of the country.
* @returns {Promise<Object[]>} - A Promise that resolves to an array of city objects containing their name, latitude, and longitude.
* @throws {Error} - If an error occurs during the process.
*/
async function fetchCities(countryCode) {
  try {
    const query = `[out:json][timeout:5000];area['ISO3166-1'='${countryCode}'];node[place=city](area)[population~"^[0-9]{6,}$"];out center;`;

    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: {
        data: query,
      },
    });

    const cities = response.data.elements
      .sort((a, b) => b.tags.population - a.tags.population)
      .slice(0, 10)
      .map(city => {
        const name = city.tags['name:en'] || city.tags.name;
        const lat = city.lat;
        const lon = city.lon;
        return { name, lat, lon };
      });

    return cities;
  } catch (error) {
    return { error: error.message };
  }
}

/**
* Fetches the top tourist attractions in the cities of the specified country.
* @param {string} countryCode - The country code (ISO 3166-1) of the country.
* @returns {Promise<Object>} - A Promise that resolves to an object containing the tourist attractions grouped by city.
* @throws {Error} - If an error occurs during the process.
*/
async function fetchSights(countryCode) {
    try {
      const cities = await fetchCities(countryCode);
      const sightsByCity = {};
  
      for (const city of cities) {
        const sights = [];
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:Tourist_attractions_in_${city.name}&gcmlimit=max&prop=pageimages&piprop=original&pithumbsize=500`;
  
        const response = await axios.get(url);
        const data = response.data.query;
  
        if (data && data.pages) {
          const pages = data.pages;
  
          Object.values(pages)
            .slice(0, 3)
            .forEach(page => {
              const title = page.title;
              const image = page.original?.source;
  
              if (image) {
                sights.push({ name: title, image: image });
              }
            });
  
          if (sights.length > 0) {
            sightsByCity[city.name] = {
              sights,
              coordinates: [city.lat, city.lon],
            };
          }
        }
      }
  
      return sightsByCity;
    } catch (error) {
      return { error: error.message };
    }
}

/**
* Fetches random cities with their associated tourist attractions in the specified country.
* @param {string} countryCode - The country code (ISO 3166-1) of the country.
* @returns {Promise<Object>} - A Promise that resolves to an object containing random cities with their tourist attractions.
* @throws {Error} - If an error occurs during the process.
*/
async function fetchRandomCities(countryCode) {
  try {
    const response = await fetchSights(countryCode);
    const cities = Object.keys(response);
    const shuffledCities = cities.sort(() => Math.random() - 0.5);
    const randomCities = shuffledCities.slice(0, 3);

    // Erstelle das Objekt mit den 3 zufälligen Städten
    const randomCitiesObj = {};
    for (const city of randomCities) {
      randomCitiesObj[city] = response[city];
    }

    // Gib das Ergebnis zurück
    return randomCitiesObj;
  } catch (error) {
    return { error: error.message };
  }
}


module.exports = { fetchSights, fetchCities, fetchRandomCities, calculateDistance };
