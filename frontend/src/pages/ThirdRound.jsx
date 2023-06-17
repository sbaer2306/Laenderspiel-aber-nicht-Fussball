import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SightCard from '../components/Sights/SightCard';
import LocationMarker from '../components/map/LocationMarker';
import '../css/ThirdRound.css'
import { Text, Button, Spinner, Box, Center, CircularProgress } from '@chakra-ui/react';
import { MapContainer, TileLayer } from 'react-leaflet';

axios.defaults.withCredentials = true;

const ThirdRound = () => {
  const url = 'http://localhost:8000/game/400/sights';
  const [sights, setSights] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [answerState, setAnswerState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [cityCoordinates, setCityCoordinates] = useState([]);
  const [coordinatesData, setCoordinatesData] = useState(null);
  const [centerCity, setCenterCity] = useState([]);
  const [lastMarkerPosition, setLastMarkerPosition] = useState(null);
  const [time, setTime] = useState(0)

  const MAX_TIME = 100; //10min for now

  const createGame = async () => {
    try {
      const gameResponse = await axios.post('http://localhost:8000/game', {
        difficulty: 'easy',
      });
      setCountryName(gameResponse.data.game.country_name);
    } catch (error) {
      console.log(error);
    }
  };

  const getSights = async () => {
    try {
      const response = await axios.get(url);
      setSights(response.data);

      setIsLoading(false);
      console.log(response.data);

      const key = Object.keys(response.data)[0];
      setCenterCity(response.data[key].coordinates);
      // console.log(response.data[key].coordinates);
      console.log(centerCity);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('centerCity:', centerCity);
  }, [centerCity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createGame();
        await getSights();
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }
  }, [isLoading]);

  const handleMarkerClick = (position) => {
    setCityCoordinates((prevCoordinates) => {
      const updatedCoordinates = [...prevCoordinates];
      updatedCoordinates[currentCityIndex] = position;
      return updatedCoordinates;
    });
  };
  
  const handleNextCity = () => {
    const nextIndex = currentCityIndex + 1;
  
    if (nextIndex < Object.keys(sights).length) {
      setCurrentCityIndex(nextIndex);
    } else {
      setIsSubmitted(true);
  
      const updatedCoordinatesData = Object.keys(sights).reduce((acc, city, index) => {
        const cityData = {
          coordinates: sights[city].coordinates,
          guessed_coordinates: cityCoordinates[index],
        };
        acc[city] = cityData;
        return acc;
      }, {});
  
      console.log('Coordinates data:', updatedCoordinatesData);
      setCoordinatesData(updatedCoordinatesData);
    }
  };

  return (
    <div>
      <div className="Timer-Container">
        <CircularProgress value={time * (100 / MAX_TIME)} size="70px" />
      </div>

      <Text mb={1} fontSize='2xl' textAlign="center">Round 3</Text>
      <Text m={2} fontSize='xl'>Try to guess the cities based on some sights of</Text>
      <Text m={2} fontSize='xl' fontWeight='700'>{countryName}</Text>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </Box>
      ) : (
        <div className='SightCards-Container'>
          {/* <h2>Sights Response:</h2>
              <pre>{JSON.stringify(sights, null, 2)}</pre> */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {Object.keys(sights).length > 0 ? (
              sights[Object.keys(sights)[currentCityIndex]].sights.map((sight, sightIndex) => (
                <SightCard key={sightIndex} title={sight.name} imageURL={sight.image} />
              ))
            ) : (
              <p>No sights available</p>
            )}
          </div>
          <Center>
            <MapContainer center={centerCity} zoom={5} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
            />
            <LocationMarker childToParent={handleMarkerClick} clicked={isSubmitted}/>
            </MapContainer>
            <Button spacing={5} colorScheme='blue' size='md' align='center' onClick={handleNextCity}>Submit</Button>
            </Center>
        </div>
      )}
    </div>
  );
};

export default ThirdRound;
