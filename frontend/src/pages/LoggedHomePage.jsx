import React from 'react'
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
//import {createNewGame} from '../../../backend/apis/gameAPI';

export const LoggedHomePage = () => {
  const startNewGame = async () => {
      //createNewGame("easy");
      //import from backend not working

      try{
        const response = await axios.post('/game', {
        difficulty: 'easy'
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
  };

  return (
    <Box py={28}>
      <Center>
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={24}>
          <Text mb={4} fontSize='2xl' textAlign="center">
            Spiel
          </Text>
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

