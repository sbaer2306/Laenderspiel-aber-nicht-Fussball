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
    </Box>
  );
}

export default LoggenInHomepage;
