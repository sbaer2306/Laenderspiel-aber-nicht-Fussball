import React, {useState} from 'react'
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

  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  }

  const startNewGame = async () => {
    if(selectedDifficulty){
      try{
        const response = await axios.post('https://localhost:8000/game', {
          body: {
            difficulty: selectedDifficulty,
          }
        });
        const {game, links} = response.data;

        //link logic
        if(links && links.nextStep){
            const nextStepLink = links.nextStep;
            //navigate
        }
        console.log("Game from response.data: ", game);
    }catch(error){
        console.log("error createNewGame: ",error);
    }
      //const response = createNewGame(selectedDifficulty);
      //backend still not 'working' for imports
    }
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

