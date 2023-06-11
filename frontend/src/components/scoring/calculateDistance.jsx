import { useState, useEffect } from 'react'
import axios from 'axios';

function calculateDistance (markerPosition, center) {

  const url = 'http://localhost:8000/game/400/rating/geo-information';
  
  const calculateRequest = async () => {
    try{
      console.log(markerPosition);
      //console.log(center);
      const response = await axios.post(url, { "markerPosition": {markerPosition}, "center": {center}})
      
    }catch(error){
      console.error(error);
    }
    
  }

  useEffect(() => {
    calculateRequest();
  }, []);

  return (
    <div>calculateDistance</div>
  )
}

export default calculateDistance