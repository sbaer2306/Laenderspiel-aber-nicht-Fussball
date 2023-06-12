import '../css/SecondRound.css'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { Text, Center, Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import converter from 'osmtogeojson'
import LocationMarker from '../components/map/LocationMarker';
import Polyline from '../components/map/Polyline'
import Distance from '../components/scoring/calculateDistance'

axios.defaults.withCredentials = true;

function SecondRound() {

  const [countryName, setCountryName] = useState('');
  const [data, setData] = useState('');
  const [position, setPosition] = useState('');
  const [center, setCenter] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const url = 'http://localhost:8000/game/400/geo-information';

  const createGame = async () => {
    try{
      const gameResponse = await axios.post('http://localhost:8000/game', { "difficulty": "easy" });
      setCountryName(gameResponse.data.game.country_name)
    }catch(error){
      console.log(error);
    }

  }

  const getOsmData = async () => {
    try{
      setButtonClicked(true);
      setIsLoading(true);

      // Verwende die Session-ID, um das Game-Objekt abzurufen
      const response = await axios.get(url);
      setData(converter(response.data.geometry));
      
      let centerCountry = {lat: response.data.center.lat, lon: response.data.center.lon};
      setCenter(centerCountry);
     
      setIsLoading(false);
    }catch(error){
      console.error(error);
    }
    
  }

  const MarkerPosition = (childdata) =>{
    setPosition(childdata);
  }

  useEffect(() => {
    createGame();
  }, []);

  return (
    <Box align="center">
      <Text mb={1} fontSize='2xl' textAlign="center">Round 2</Text>
      <Text m={2} fontSize='xl'>Try to guess the center of the country</Text>
      <Text m={2} fontSize='xl' fontWeight='700'>{countryName}</Text>
      <Center>
          <MapContainer center={[50, 10]} zoom={3} scrollWheelZoom={true}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
              />
              <LocationMarker childToParent={MarkerPosition} clicked={buttonClicked}/>
              {data ? <GeoJSON data={data} pointToLayer= {e =>{return null}}/> : null}
              {position && center ? (<Polyline marker={position} center={center}/>) : (null)}
          </MapContainer>
      </Center>
      {!data && position ? <Button isLoading={isLoading} mt={5} spacing={5} colorScheme='blue' size='md' align='center' onClick={getOsmData}>Versuch auswerten</Button> : null}
      <Box align="left" mt={5} fontSize="xl" fontWeight="700">
        {data ? <Distance markerPosition={position} center={center}/> : null}
      </Box>
    </Box>
  );
}

export default SecondRound;
