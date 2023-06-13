import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/userAuthContext";
import { Spinner, Box, useToast } from "@chakra-ui/react";

const TIMEOUT_DURATION = 500;

const ProtectedRoute = ({ children }) => {
  const { currentUser, userIsLoggedIn } = useUserAuth();
  const [authStateHasNotBeenReceived, setAuthStateHasNotBeenReceived] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    if (currentUser === null) {
    //--> falls user in context nicht schnell genug gesetzt wird lieber mal kurz warten
      timeoutId = setTimeout(() => {
        setAuthStateHasNotBeenReceived(false);
        if (!userIsLoggedIn()) {
          toast({
            title: "Authentication required.",
            description: "Log in to see this.",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top"
          });
          navigate("/");
        }
      }, TIMEOUT_DURATION);
    } else {
      setAuthStateHasNotBeenReceived(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentUser, userIsLoggedIn, toast, navigate]);

  if (authStateHasNotBeenReceived) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner />
      </Box>
    );
  }

  if (currentUser) {
    return (
      <>
        {children}
      </>
    );
  }
};

export default ProtectedRoute;