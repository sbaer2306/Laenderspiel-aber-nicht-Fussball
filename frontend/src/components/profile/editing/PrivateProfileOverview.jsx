import { useEffect, useState } from 'react';
import { Box, useToast, Text, Divider } from '@chakra-ui/react';
import axios from 'axios';
import ProfileEditor from './ProfileEditor';
import GameHistory from '../GameHistory';

const DUMMY_ID = 1;

const PrivateProfileOverview = () => {
  const [profile, setProfile] = useState({}); 

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

  return (
    <>
    <Text fontSize='xl' fontWeight='semibold'>Personal Profile Overview</Text>
    <Divider my={5}/>
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