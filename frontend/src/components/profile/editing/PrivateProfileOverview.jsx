import { useEffect, useState } from 'react';
import { Box, useToast, Text, Divider } from '@chakra-ui/react';
import axios from 'axios';
import ProfileEditor from './ProfileEditor';
import GameHistory from '../GameHistory';
import ProfileOperationsButtonBar from './ProfileOperationsButtonBar';

const DUMMY_ID = 1;

const PrivateProfileOverview = () => {
  const [profile, setProfile] = useState({}); 
  const [eTag, setETag] = useState("");

  const toast = useToast();
  const showToastMessage = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "bottom-left",
      variant: "left-accent"
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    axios.get(`http://localhost:8000/user/${DUMMY_ID}/profile`)
      .then((response) => {
  
        if (response.status === 200) {
          setProfile(response.data);
          showToastMessage("Profile loaded!", "", "info");
        } else {
          console.log(`An error occurred: ${response.status}`);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if (error.response.status === 403) {
            showToastMessage(error.response.status, error.response.data.message, "error");
          } else if (error.response.status === 404) {
            showToastMessage(error.response.status, error.response.data.message, "error");
          } else {
            console.log(`An error occurred: ${error.response.status}`);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
  };  

  const updateProfile = async (values) => {
    const { id, firstName, lastName, bio, isPrivate, location } = values;
    try {
      const response = await axios.put(`http://localhost:8000/profile/${id}`, {
        firstName,
        lastName,
        bio,
        isPrivate,
        location
      });
  
      if (response.status === 200) {
        setProfile(response.data);
        showToastMessage("Profile updated!", "", "success");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          showToastMessage(error.response.status, error.response.data.message, "error");
        } else if (error.response.status === 404) {
          showToastMessage(error.response.status, error.response.data.message, "error");
        } else if (error.response.status === 500) {
          showToastMessage(error.response.status, error.response.data.message, "error");
        } else if (error.response.status === 400) {
          showToastMessage(error.response.status, error.response.data.message, "error");
        }
      }
    }
  };  

  const deleteUserAccount = async () => {
    alert("TODO: Implement delete user account");
  };

  const deleteGameHistory = async () => {
    alert("TODO: Implement delete game history");
  };

  /**
   * SIMULATION for ETag caching.
   * 
   * "Unfortunately, there isn't a way to handle a 304 Not Modified response in the browser like you can in Postman, due to the browser's built-in HTTP caching behavior.
   * By the time your JavaScript code receives the response, the browser has already checked the server's caching headers (like ETag), made the decision to use the cached response, and converted the 304 Not Modified status to a 200 OK."
   * ~ ChatGPT
   * Source: https://datatracker.ietf.org/doc/html/rfc7234#section-4.3.3 
   */
  const calculateStats = async () => {
    axios
    .get('http://localhost:8000/user/1/stats', {
      headers: {
        'If-None-Match': eTag
      }
    })
    .then((response) => {
      const newEtag = response.headers['etag'];
      
      if (newEtag === eTag) {
        showToastMessage("Done - Nothing changed!", "", "success");
        console.log("ETag values are the same.");
      } else {
        setETag(newEtag);
        const data = response.data;
      }
    })
    .catch((error) => {
      if (error.response) {
          showToastMessage(error.response.status, error.response.data.message, "error");
      }else {
        console.log('Error', error.message);
      }
    });
  };

  return (
    <>
    <Text fontSize='xl' fontWeight='semibold'>Personal Profile Overview</Text>
    <Divider my={5}/>
    <Box maxW='600px' margin='auto' mt={5}>
    <ProfileOperationsButtonBar 
      calcStats={calculateStats}
      deleteHistory={deleteGameHistory}
      deleteAccount={deleteUserAccount}
    />
    </Box>
      {Object.keys(profile).length > 0 && (
      <ProfileEditor passedProfile={profile} updateProfile={updateProfile} />
    )}
    <Box maxW='600px' margin='auto' mt={5}>
      <GameHistory id={DUMMY_ID}/>
    </Box>
    
    </>
  );
};

export default PrivateProfileOverview;