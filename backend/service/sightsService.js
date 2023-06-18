const axios = require('axios');

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


module.exports = { fetchSights, fetchCities, fetchRandomCities };
