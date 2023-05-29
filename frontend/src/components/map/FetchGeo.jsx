import React from 'react';
import { useEffect, useState } from 'react';
//import axios from 'axios';
import converter from 'osmtogeojson'
import { GeoJSON } from 'react-leaflet'

function MyData({childToParent}) {
    // create state variable to hold data when it is fetched
    const [data, setData] = useState('');
    const [center, setCenter] = useState('');
  
    const url = 'https://overpass-api.de/api/interpreter?data=';
    const fetch = '[out:json];relation["boundary"="administrative"]["name"="Deutschland"];out geom;';
  
    // useEffect to fetch data on mount
    useEffect(() => {
      // async function!
/*       const getData = async () => {
        // 'await' the data
        const response = await axios.get(url+fetch);
        // save data to state
        console.log(response.data);
        setData(converter(response.data));
        let lat = response.data.elements[0].members[0].lat;
        let lng = response.data.elements[0].members[0].lon;
        setCenter({lat: lat, lng : lng});
      };
      getData(); */
    }, []);
  
    // render react-leaflet GeoJSON when the data is ready
    if (data) {
      return <GeoJSON data={data} pointToLayer= {e =>{return null}} onClick={childToParent(center)}/>;
    } else {
      return null;
    }
  };

  export default MyData;