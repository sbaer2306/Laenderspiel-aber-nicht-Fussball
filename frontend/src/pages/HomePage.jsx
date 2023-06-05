import React from 'react'
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';

export const HomePage = () => {
  const handleGoogleLogin = () => {
      window.open("http://localhost:8000/auth/google", "_self", 'toolbar=no, scrollbars=yes, resizable=no, width=1000, height=auto')

  };

  return (
    <Box py={8}>
      <Center>
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={8}>
          <Text mb={4} fontSize='2xl' textAlign="center">
            Login
          </Text>
          <Button
            leftIcon={<FcGoogle />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

