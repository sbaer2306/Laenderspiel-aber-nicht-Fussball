const axios = require('axios');


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