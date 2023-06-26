import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Text, Select } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios'

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
            navigate(links.nextStep.operationRef, {state: {id: links.nextStep.parameters.id}}); 
        }
        console.log("Game from response.data: ", game);
      }catch(error){
          if(error.response && error.response.status === 409){
            alert("You already have a game in progress");
            if(error.game.current_round == 1) navigate('/game/facts')
            if(error.game.current_round == 2) navigate('/game/geo-information')
            if(error.game.current_round == 3) navigate('/game/sights')
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
            Game!
          </Text>
          <Select
            placeholder="Choose difficulty"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            mb={4}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={startNewGame}
          >
            New Game
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

