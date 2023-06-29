import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Spinner, Box, Text, Button, Center, Select } from "@chakra-ui/react";
import { useUserAuth } from "../hooks/userAuthContext"
import { FaPlus } from 'react-icons/fa';
import api from '../helpers/axios'
import axios from 'axios'

function LoggenInHomepage() {
  const { getCurrentUser } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

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
  
        const response = await api.post('/game', requestBody, config);

        const { game, links } = response.data;
        
        //link logic
        if(links && links.nextStep){
            navigate(links.nextStep.operationRef, {state: {id: links.nextStep.parameters.id}}); 
        }
        console.log("Game from response.data: ", game);
      }catch(error){
          if(error.response && error.response.status === 409){
            alert(error.response.data.message);
            const game = error.response.data.game;
            console.log("round: ", game);
            if(game.current_round == 1) navigate('/game/facts', {state: {id: game.id}})
            if(game.current_round == 2) navigate('/game/geo-information', {state: {id: game.id}})
            if(game.current_round == 3) navigate('/game/sights', {state: {id: game.id}})
          } 
          else console.log("error: ", error.message)
      }
    }
    else alert("Select Difficulty")
  };

  useEffect(() => {
    if (getCurrentUser() !== null) {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl">Welcome, @{getCurrentUser().username}!</Text>
       <Box py={28}>
      <Center>
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={24}>
          <Text mb={4} fontSize='2xl' textAlign="center">
            Spiel
          </Text>
          <Select
            placeholder="Select Difficulty"
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
    </Box>
  );
}

export default LoggenInHomepage;
