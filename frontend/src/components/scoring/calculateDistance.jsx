import { useState, useEffect } from 'react'
import axios from 'axios';

function calculateDistance ({markerPosition, center}) {
  const [distance, setDistance] = useState('')
  const url = 'http://localhost:8000/game/400/rating/geo-information';
  
  const calculateRequest = async () => {
    try{
      const response = await axios.post(url, {"guessed_position": {lat: markerPosition.lat, lon: markerPosition.lng}, "center": {lat: center.lat, lon: center.lon}})
      setDistance(response.data.distance);
    }catch(error){
      console.error(error);
    }
    
  }

  useEffect(() => {
    calculateRequest();
  }, []);

  return (
    <div>The distance to the center is: {distance}km!</div>
  )
}

export default calculateDistance