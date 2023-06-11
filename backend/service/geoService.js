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
    
}

module.exports = {fetchOsmData, getCenterOfCountry, calculateDistance};