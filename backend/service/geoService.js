const axios = require('axios');

/**
 * Fetches geo-information and borders for a country using the Overpass API.
 * Sends a request to the Overpass API based on the country name.
 * 
 * @param {String} countryName - The name of the country.
 * @returns {Object} - The fetched geo-information and borders in JSON format.
 * @throws {Error} - If an error occurs during the process.
 */
async function fetchOsmData(countryName){//gameid als parameter?
    try{
        const url = `https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["name:en"="${countryName}"];out geom;`;

        const response = await axios.get(url);

        return response.data;
    }catch(error){
        console.error('Error for the OSM-Response', error);
        throw error;
    }
}

/**
 * Retrieves the center coordinates of a country based on the provided geo-information.
 * 
 * @param {Object} osmData - The retrieved geo-information and borders for a country.
 * @returns {Object} - The center coordinates of the country.
 */
function getCenterOfCountry(osmData){
    let latCenter = "";
    let lonCenter = ""; 
    
    for(let i = 0; i < osmData.length; i++){
        if(osmData[i].role === "label"){
            latCenter = osmData[i].lat;
            lonCenter = osmData[i].lon;
        }
    }

    const center = {
        lat: latCenter,
        lon: lonCenter,
    }

    return center;
}

/**
 * Calculates the distance between two points using the Haversine formula.
 * 
 * @param {Object} markerPosition - The coordinates of the marker position.
 * @param {Object} center - The center coordinates of a country.
 * @returns {number} - The calculated distance in kilometers.
 */
function calculateDistance(markerPosition, center){
    //Calculate the distance between 2 Points based on the Haversine formula 
    let latRadPosition = markerPosition.lat * Math.PI / 180;
    let lonRadPosition = markerPosition.lon * Math.PI / 180;
    let latRadCenter = center.lat * Math.PI / 180;
    let lonRadCenter = center.lon * Math.PI / 180; 

    //Earth radius
    let radius = 6378.388;

    let dLat = latRadPosition - latRadCenter;
    let dLon = lonRadPosition - lonRadCenter;

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(latRadPosition) * Math.cos(latRadCenter) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let distance = radius * c;

    return Math.round(distance);
}

module.exports = {fetchOsmData, getCenterOfCountry, calculateDistance};