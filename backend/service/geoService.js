const axios = require('axios');


async function fetchOsmData(countryName){//gameid als parameter?
    try{
        const url = `https://overpass-api.de/api/interpreter?data=[out:json];relation["boundary"="administrative"]["name"="${countryName}"];out geom;`;

        const response = await axios.get(url);

        return response.data;
    }catch(error){
        console.error('Fehler bei der OSM-Anfrage', error);
        throw error;
    }
}

module.exports = fetchOsmData;


/*       const getData = async () => {
        // 'await' the data
        const response = await axios.get(url+fetch);
        // save data to state
        console.log(response.data);
        setData(converter(response.data));
        let lat = response.data.elements[0].members[0].lat;
        let lng = response.data.elements[0].members[0].lon;
        setCenter({lat: lat, lng : lng});*/