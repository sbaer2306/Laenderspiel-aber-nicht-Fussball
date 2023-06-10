import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import converter from 'osmtogeojson'
import { GeoJSON } from 'react-leaflet'

axios.defaults.withCredentials = true;

function MyData({childToParent}) {
    // create state variable to hold data when it is fetched
    const [data, setData] = useState('');
    const [center, setCenter] = useState('');
  
    const url = 'http://localhost:8000/game/400/geo-information';
    
      // useEffect to fetch data on mount

      const getData = async () => {
        try{
          const gameResponse = await axios.post('http://localhost:8000/game', { "difficulty": "easy" });
  
          // Verwende die Session-ID, um das Game-Objekt abzurufen
          const response = await axios.get(url);
          setData(converter(response.data.geometry));
          let centerCountry = {lat: response.data.center.lat, lon: response.data.center.lon};
          setCenter(centerCountry);
        }catch(error){
          console.error(error);
        }
        
      }

    useEffect(() => {
      getData();
    }, []);
  
    // render react-leaflet GeoJSON when the data is ready
    if (data) {
      return <GeoJSON data={data} pointToLayer= {e =>{return null}} onClick={childToParent(center)}/>;
    } else {
      return null;
    }
  };

  export default MyData;