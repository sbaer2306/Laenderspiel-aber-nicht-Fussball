import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Text, Select } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios'
//import { createNewGame } from '../../../backend/apis/gameAPI';

const exampleGame = {
  id: 7,
  user_id: 1, //userId comes from middleware - please give it to me bastiiii :D
  current_round: 1,
  max_rounds: 3,
  ttl: 900,
  created_at: new Date().toISOString(),
  difficulty: 2.56,
  country_id: "DE",
  current_score: null,
  total_score: null,
}

export const LoggedHomePage = () => {

  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  const startNewGame = async () => {
    if(selectedDifficulty){
      try{
        const requestBody = {
          difficulty: selectedDifficulty,
        };
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const response = await axios.post('http://localhost:8000/game', requestBody, config);
        const { game, links } = response.data;

        //link logic
        if(links && links.nextStep){
            navigate(links.nextStep.operationRef, {state: {id: links.nextStep.parameters.id}}); //should be /game/facts
        }
        console.log("Game from response.data: ", game);
      }catch(error){
          if(error.response && error.response.status === 400){
            alert("You already have a game in progress");
            navigate('game/facts')
          } 
          else console.log("error: ", error.message)
      }
    }
    else alert("Wähle Schwierigkeit")
  };



  return (
    <Box py={28}>
      <Center>
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={24}>
          <Text mb={4} fontSize='2xl' textAlign="center">
            Spiel
          </Text>
          <Select
            placeholder="Schwierigkeitsgrad wählen"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            mb={4}
          >
            <option value="easy">Einfach</option>
            <option value="medium">Mittel</option>
            <option value="hard">Schwer</option>
          </Select>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={startNewGame}
          >
            Neues Spiel
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

