import React, { useEffect, useState } from 'react';
import SightCard from '../components/Sights/SightCard';
import LocationMarker from '../components/map/LocationMarker';
import '../css/ThirdRound.css'
import { Text, Button, Spinner, Box, Center, CircularProgress } from '@chakra-ui/react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {useLocation, useNavigate} from 'react-router-dom'
import api from '../helpers/axios';

import CityMarkers from '../components/map/CityMarkers'; // adjusted


const ThirdRound = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const countryName = location.state?.country_name;
  const center = location.state?.center;

  const [sights, setSights] = useState([]);
  // const [countryName, setCountryName] = useState('');
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
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const MAX_TIME = 180; // 3 Minuten

  const sendGameData = async () => {
    const gameData = {
      time_to_complete_game: time,
      ...Object.keys(sights).reduce((acc, city, index) => {
        const cityData = {
          coordinates: sights[city].coordinates,
          guessed_coordinates: Object.values(cityCoordinates[index]),
          sights: sights[city].sights.length
        };
        acc[city] = cityData;
        return acc;
      }, {})
    };
  
    try {
      const response = await api.post(`/game/${id}/rating/sights`, gameData);
      
      // console.log('Game data sent:', response.data);
        
      console.log(response.data);
    } catch (error) {
      console.error('Failed to send game data:', error);
    }
  };

  const getSights = async () => {
    try {
      const response = await api.get(`/game/${id}/sights`);
      setSights(response.data);

      setIsLoading(false);
      console.log(response.data);

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
        // await createGame();
        await getSights();
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (isTimerRunning && !isLoading) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }
  }, [isTimerRunning, isLoading]);

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
      setIsTimerRunning(false); // Timer stoppen
  
      const updatedCoordinatesData = Object.keys(sights).reduce((acc, city, index) => {
        const cityData = {
          coordinates: sights[city].coordinates,
          guessed_coordinates: cityCoordinates[index],
        };
        acc[city] = cityData;
        return acc;
      }, {});
  
      console.log('Coordinates data:', updatedCoordinatesData);
      console.log('Time:', time); // Zeit ausgeben
  
      setCoordinatesData(updatedCoordinatesData);
  
      sendGameData(); // Daten an den Endpunkt senden
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <MapContainer center={[center.lat, center.lon]} zoom={6} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {
                // https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png
              }
              <LocationMarker childToParent={handleMarkerClick} clicked={isSubmitted} />
            </MapContainer>
          </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button spacing={5} colorScheme='blue' size='md' align='center' onClick={handleNextCity}>Submit</Button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ThirdRound;
