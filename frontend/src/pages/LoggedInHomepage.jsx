import React, { useEffect, useState } from "react";
import { Spinner, Box, Text } from "@chakra-ui/react";
import { useUserAuth } from "../hooks/userAuthContext"

function LoggenInHomepage() {
  const { getCurrentUser } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

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
    </Box>
  );
}

export default LoggenInHomepage;
