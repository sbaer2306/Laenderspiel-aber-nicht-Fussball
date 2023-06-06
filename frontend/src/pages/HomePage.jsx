import React from 'react'
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import GoogleLoginButton from '../components/GoogleLoginButton';

export const HomePage = () => {
  return (
    <Box py={8}>
      <Center>
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={8}>
          <Text mb={4} fontSize='2xl' textAlign="center">
            Login
          </Text>
          <GoogleLoginButton></GoogleLoginButton>
        </Box>
      </Center>
    </Box>
  );
};

