import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { useUserAuth } from '../hooks/userAuthContext';

function GoogleLoginButton() {
  
  const { handleGoogleLogin } = useUserAuth();

  const handleLoginClick = () => {
    handleGoogleLogin();
  }

  return (
      <Button
            leftIcon={<FcGoogle />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={handleLoginClick}>
        Login with Google
      </Button>
    );
}

export default GoogleLoginButton;
