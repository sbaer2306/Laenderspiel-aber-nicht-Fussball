import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SightCard from '../components/Sights/SightCard';
import '../css/ThirdRound.css'
import { Text, Button, Input } from '@chakra-ui/react';

axios.defaults.withCredentials = true;

const ThirdRound = () => {
  const url = 'http://localhost:8000/game/400/sights';
  const [sights, setSights] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userInputs, setUserInputs] = useState([]);

  const example = {
    // ...
  };

  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const nextCity = () => {
    setCurrentCityIndex((prevIndex) => (prevIndex + 1) % Object.keys(sights).length);
  };
  
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createGame();
        await getSights();
        setUserInputs(Array(Object.keys(sights).length).fill('')); // Initialisierung des Arrays für Benutzereingaben
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && Object.keys(sights).length > 0) {
      // Überprüfung, ob die Sights-Daten verfügbar sind
      console.log('Sights are available');
    }
  }, [isLoading, sights]);

  const handleInputChange = (event) => {
    const index = currentCityIndex;
    const updatedInputs = [...userInputs];
    updatedInputs[index] = event.target.value;
    setUserInputs(updatedInputs);
  };

  const saveUserInput = () => {
    const index = currentCityIndex;
    const userInput = userInputs[index];
    // Hier kannst du die Benutzereingabe speichern oder weitere logische Operationen durchführen
    console.log(`User Input for City ${index + 1}:`, userInput);
  };

  return (
    <div>
      <Text mb={1} fontSize='2xl' textAlign="center">Round 3</Text>
      <Text m={2} fontSize='xl'>Try to guess the cities based on some sights of</Text>
      <Text m={2} fontSize='xl' fontWeight='700'>{countryName}</Text>

      {isLoading ? (
        <p>Loading...</p>
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
        </div>
      )}
      <div className='Submit-Container'>
        <Input type="text" value={userInputs[currentCityIndex]} onChange={handleInputChange} placeholder="Enter your guess" />
        <Button onClick={saveUserInput} colorScheme='blue' size="md">Submit</Button>
        <Button onClick={nextCity} colorScheme='blue' size="md">Next City</Button>
      </div>
    </div>
  );
};

export default ThirdRound;
