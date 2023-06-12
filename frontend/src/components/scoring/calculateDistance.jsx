import { useState, useEffect } from 'react'
import axios from 'axios';
import { Text, Center, Box, Button } from '@chakra-ui/react';

function calculateDistance ({markerPosition, center}) {
  const [distance, setDistance] = useState('');
  const [score, setScore] = useState('');
  const url = 'http://localhost:8000/game/400/rating/geo-information';
  
  const calculateRequest = async () => {
    try{
      const response = await axios.post(url, {"guessed_position": {lat: markerPosition.lat, lon: markerPosition.lng}, "center": {lat: center.lat, lon: center.lon}})
      setDistance(response.data.distance);
      setScore(response.data.score);
    }catch(error){
      console.error(error);
    }
    
  }

  useEffect(() => {
    calculateRequest();
  }, []);

  return (
    <Box>
      <Text>The distance to the center is: {distance}km</Text>
      <Center>Your new Score is: {score}!</Center>
    </Box>

    
  )
}

export default calculateDistance