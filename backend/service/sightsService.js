const axios = require('axios');

async function fetchCities(countryCode) {
    try {
      const query = `[out:json][timeout:5000];area['ISO3166-1'='${countryCode}'];node[place=city](area);out center;`;
  
      const response = await axios.post('https://overpass-api.de/api/interpreter', query);
      const cities = response.data.elements.map(city => {
        const name = city.tags['name:en'] || city.tags.name;
        const lat = city.lat;
        const lon = city.lon;
        return { name, lat, lon };
      });
  
      // Shuffle the cities array
      // const shuffledCities = cities.sort(() => Math.random() - 0.5);
  
      // Get the first 'numCities' elements from the shuffled array
      // const randomCities = shuffledCities.slice(0, 3);
  
      // return randomCities;
      return cities;
    } catch (error) {
      return { error: error.message };
    }
  }

  /*
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
          const pageValues = Object.values(pages);
  
          const randomPages = [];
          const maxRandomIndex = Math.min(pageValues.length, 3);
          const visitedIndices = new Set();
  
          while (randomPages.length < maxRandomIndex) {
            const randomIndex = Math.floor(Math.random() * pageValues.length);
  
            if (!visitedIndices.has(randomIndex)) {
              visitedIndices.add(randomIndex);
              randomPages.push(pageValues[randomIndex]);
            }
          }
  
          randomPages.forEach(page => {
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
  
module.exports = { fetchSights, fetchCities };
