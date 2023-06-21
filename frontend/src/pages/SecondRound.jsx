import '../css/SecondRound.css'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { Text, Center, Box, Button, CircularProgress, useToast, useDisclosure } from '@chakra-ui/react';
import api from '../helpers/axios'
import converter from 'osmtogeojson'
import LocationMarker from '../components/map/LocationMarker';
import Polyline from '../components/map/Polyline'
import ConfirmationModal from '../components/UI/ConfirmationModal';

function SecondRound() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const countryName = location.state?.country_name;
  const [data, setData] = useState('');
  const [position, setPosition] = useState('');
  const [center, setCenter] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(null);
  const [score, setScore] = useState(null);
  const [links, setLinks] = useState(null);
  const { isOpen: deletionModalIsOpen, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();


  const MAX_TIME = 300;

  const getOsmData = async () => {
    try{
      setButtonClicked(true);
      setIsLoading(true);

      // Verwende die Session-ID, um das Game-Objekt abzurufen
      const response = await api.get(`/game/${id}/geo-information`);
      setData(converter(response.data.geometry));

      let centerCountry = {lat: response.data.center.lat, lon: response.data.center.lon};
      setCenter(centerCountry);
      calculateRequest(centerCountry);
      setIsLoading(false);
    }catch(error){
      console.error(error);
    }
    
  }

  const MarkerPosition = (childdata) =>{
    setPosition(childdata);
  }

  const calculateRequest = async (center) => {
    try{
      const response = await api.post(`/game/${id}/rating/geo-information`, {"time": time, "guessed_position": {lat: position.lat, lon: position.lng}, "center": {lat: center.lat, lon: center.lon}})
      setDistance(response.data.distance);

      console.log(response.data);

      setScore(response.data.score);
      setLinks(response.data.links);
    }catch(error){
      console.error(error);
    }
    
  }

  const nextRound = () => {
    if(links.nextStep){
      console.log(links);
      navigate(links.nextStep.operationRef, {state: {id: links.nextStep.parameters.id, center: links.nextStep.parameters.center}});
    }
  }

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
  }, 1000);

  return () => {
      clearInterval(timer);
  }
  }, []);

  return (
    <Box align="center">
      <Text mb={1} fontSize='2xl' textAlign="center">Round 2</Text>
      <Box align="right"><CircularProgress value={time * (100/MAX_TIME)} size='60px' /></Box>
      <Text m={2} fontSize='xl'>Try to guess the center of the country</Text>
      <Text m={2} fontSize='xl' fontWeight='700'>{countryName}</Text>
      <Center>
          <MapContainer center={[50, 10]} zoom={3} scrollWheelZoom={true}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
                  noWrap="false"

              />
              <LocationMarker childToParent={MarkerPosition} clicked={buttonClicked}/>
              {data ? <GeoJSON data={data} pointToLayer= {e =>{return null}}/> : null}
              {position && center ? (<Polyline marker={position} center={center}/>) : (null)}
          </MapContainer>
      </Center>
      {!data && position ? <Button isLoading={isLoading} mt={5} spacing={5} colorScheme='blue' size='md' align='center' onClick={getOsmData}>evaluate try</Button> : null}
      {distance && score ? 
        <Box align="left" mt={5} fontSize="xl" fontWeight="700">
          <Text>The distance to the center is: {distance}km</Text>
          <Center>Your new Score is: {score}!</Center>
        </Box>
       : null}
      
      <Box mt={5}>
          <Button onClick={onOpenDeletionModal} colorScheme='red' size="md" mr= {15}>Cancel</Button>
          {data ? <Button colorScheme='blue' size='md' onClick={nextRound}>Next Round</Button > : null} 
      </Box>
      <ConfirmationModal isOpen={deletionModalIsOpen} onClose={onCloseDeletionModal} onConfirm={cancelGame} title='Cancel Game.'/>
      
    </Box>
  );
}

export default SecondRound;
