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

//Don't needed
/* function getBoundariesOfCountry(osmData){
    boundaries = [];

    for(let i = 0; i < osmData.elements[0].members.length; i++){
        if(osmData[i].role === "outer"){
            boundaries.push(osmData[i])
        }
    }

    return boundaries;
} */

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

module.exports = {fetchOsmData, getCenterOfCountry};


/*       const getData = async () => {
        // 'await' the data
        const response = await axios.get(url+fetch);
        // save data to state
        console.log(response.data);
        setData(converter(response.data));
        let lat = response.data.elements[0].members[0].lat;
        let lng = response.data.elements[0].members[0].lon;
        setCenter({lat: lat, lng : lng});*/