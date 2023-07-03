import React, { useEffect, useState } from 'react';
import SightCard from '../components/Sights/SightCard';
import LocationMarker from '../components/map/LocationMarker';
import '../css/ThirdRound.css'
import { Text, Button, Spinner, Box, Center, CircularProgress, useToast, useDisclosure } from '@chakra-ui/react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {useLocation, useNavigate} from 'react-router-dom'
import api from '../helpers/axios';
import CityMarker from '../components/map/CityMarker';
import ConfirmationModal from '../components/UI/ConfirmationModal';

const ThirdRound = () => {

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  let gameDuration = location.state?.gameDuration;
  const countryName = location.state?.country_name;
  const center = location.state?.center;


  const { isOpen: deletionModalIsOpen, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();
  const [isRoundCompleted, setIsRoundCompleted] = useState(false);

  const [showScoreButton, setShowScoreButton] = useState(false);

  const [guessedCoordinates, setGuessedCoordinates] = useState([]);

  const [sights, setSights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [cityCoordinates, setCityCoordinates] = useState([]);
  const [coordinatesData, setCoordinatesData] = useState(null);
  const [lastMarkerPosition, setLastMarkerPosition] = useState(null);
  const [time, setTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const MAX_TIME = 180; 

  const showToastMessage = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "bottom-left",
      variant: "left-accent"
    });
  };

  const sendGameData = async () => {

    gameDuration += time;

    const gameData = {
      gameDuration: gameDuration,
      time: time,
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
      // post /game/id/rating/sights
      const response = await api.post(`/game/${id}/rating/sights`, gameData);
      // post /game/id/end
      const score = response.data;

      toast({
        title: "Your Total Points",
        description: `Wow, you made ${score.score} points this game!!!`,
        status:"success",
        duration: 3000,
        isClosable: true,
      });

      setShowScoreButton(true);
        
    } catch (error) {
      console.error('Failed to send game data:', error);
    }
  };

  const getSights = async () => {
    try {
      const response = await api.get(`/game/${id}/sights`);
      setSights(response.data);

      setIsLoading(false);
    } 
    catch (error) {
      if(error.response) {
        if(error.response.status === 403){
            alert("error-response: ", error.response.data.message);
        }
      }
      else {
        console.log("error fetching: " + error.message);
      }
    }
  };

  const handleGetSights = () => {
    setIsLoading(true);
    getSights();
  };
  
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
  
    setGuessedCoordinates((prevCoordinates) => {
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
      setIsTimerRunning(false); 
  
      const updatedCoordinatesData = Object.keys(sights).reduce((acc, city, index) => {
        const cityData = {
          coordinates: sights[city].coordinates,
          guessed_coordinates: cityCoordinates[index],
        };
        acc[city] = cityData;
        return acc;
      }, {});
  
      setCoordinatesData(updatedCoordinatesData);
  
      sendGameData(); 

      setIsRoundCompleted(true); 
    }
  };

  const handleScoreButtonClick = () => {
    navigate('/ranking');
  };

  const cancelGame = async () => {
    try{
      
        const response = await api.delete(`/game/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }); 
        showToastMessage("Deletion",`${response.data.message}`, "success" );
        navigate('/welcome', {replace: true})
        return;
    }catch(error){
      console.log(error);
/*         console.log("error fetching: "+error.response.data.message);
        console.log("game-id: ", error.response.data.gameid);
        console.log("id: ", error.response.data.id); */
    }
}
  
return (
  <div>
    <div className="Timer-Container">
      <CircularProgress value={time * (100 / MAX_TIME)} size="70px" />
    </div>

    <Text mb={1} fontSize='2xl' textAlign="center">Round 3</Text>
    <Text m={2} fontSize='xl'>Try to guess the cities based on some sights</Text>
    <Text m={2} fontSize='xl' fontWeight='700'>{countryName}</Text>
    <Button onClick={onOpenDeletionModal} colorScheme='red' size="md">Cancel</Button>
    <ConfirmationModal isOpen={deletionModalIsOpen} onClose={onCloseDeletionModal} onConfirm={cancelGame} title='Cancel Game.'/>
    {isLoading ? (
      <Button spacing={5} colorScheme='blue' size='md' align='center' onClick={handleGetSights}>
        Display Sights
      </Button>
    ) : (
      <div className='SightCards-Container'>
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
              noWrap="false"
            />
            {
              // https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png
            }
            
            {isRoundCompleted && <CityMarker cities={sights} guessedCoordinates={guessedCoordinates} />}
            {!isRoundCompleted && <LocationMarker childToParent={handleMarkerClick} clicked={isSubmitted} />}
            
          </MapContainer>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          {showScoreButton ? (
            <Button spacing={5} colorScheme='blue' size='md' align='center' onClick={handleScoreButtonClick}>
              Go to Ranking
            </Button>
          ) : (
            <>
              <Button spacing={5} colorScheme='blue' size='md' align='center' onClick={handleNextCity}>
                Submit
              </Button>
            </>
          )}
        </div>
      </div>
    )}
  </div>
);
};

export default ThirdRound;
