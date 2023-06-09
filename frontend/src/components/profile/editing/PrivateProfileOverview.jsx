import { useEffect, useState } from 'react';
import { Box, useToast, Text, Divider, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import ProfileEditor from './ProfileEditor';
import GameHistory from '../GameHistory';
import ProfileOperationsButtonBar from './ProfileOperationsButtonBar';
import StatsModal from '../stats/StatsModal';
import ConfirmationModal from '../../UI/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

const DUMMY_ID = 9;

const PrivateProfileOverview = () => {
  const [profile, setProfile] = useState({}); 
  const [eTag, setETag] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stats, setStats] = useState({});

  const { isOpen: deletionModalIsOpen, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();

  const navigate = useNavigate();

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
  
  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      showToastMessage(status, data.message, "error");
  
      if (status === 403 || status === 404 || status === 500 || status === 400) {
        return;
      }
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${DUMMY_ID}/profile`);
      if (response.status === 200) {
        setProfile(response.data);
        showToastMessage("Profile loaded!", "", "info");
      } else {
        console.log(`An error occurred: ${response.status}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const updateProfile = async (values) => {
    const { id, userId, createdAt, updatedAt, ...profileData } = values;
    try {
      const response = await axios.put(`http://localhost:8000/profile/${id}`, profileData);
      if (response.status === 200) {
        setProfile(response.data);
        showToastMessage("Profile updated!", "", "success");
      }
    } catch (error) {
      if (error.response?.status === 404) navigate("/");
      handleApiError(error);
    }
  };
  
  const deleteUserAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/user/${DUMMY_ID}`);
      if (response.status === 200) {
        showToastMessage("Success!", `Your account data has been deleted!.`, "success");
        navigate("/");
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const deleteGameHistory = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/user/${DUMMY_ID}/played-games`);
      if (response.status === 200) {
        showToastMessage("Game history deleted!", `Removed ${response.data.deletedNum} records.`, "success");
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const calculateStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${DUMMY_ID}/stats`, {
        headers: {
          'If-None-Match': eTag
        }
      });
  
      const newEtag = response.headers['etag'];
  
      if (newEtag === eTag) {
        showToastMessage("Done - Nothing changed!", "", "success");
        console.log("ETag values are the same.");
      } else {
        setETag(newEtag);
        const data = response.data;
        setStats(data);
      }
      onOpen();
    } catch (error) {
      handleApiError(error);
    }
  };  

  return (
    <>
    <Text fontSize='xl' fontWeight='semibold'>Personal Profile Overview</Text>
    <Divider my={5}/>
    <Box maxW='600px' margin='auto' mt={5}>
    <ProfileOperationsButtonBar 
      calcStats={calculateStats}
      deleteHistory={deleteGameHistory}
      deleteAccount={onOpenDeletionModal}
    />
    </Box>
      {Object.keys(profile).length > 0 && (
      <ProfileEditor passedProfile={profile} updateProfile={updateProfile} />
    )}
    <Box maxW='600px' margin='auto' mt={5}>
      <GameHistory id={DUMMY_ID}/>
    </Box>

    { Object.keys(stats).length > 0 && (
        <Box maxW='600px' margin='auto' mt={5}>
          <StatsModal stats={stats} isOpen={isOpen} onClose={onClose} />
        </Box>
      )
    }
    <ConfirmationModal isOpen={deletionModalIsOpen} onClose={onCloseDeletionModal} onConfirm={deleteUserAccount} title='User Account Deletion'/>
    </>
  );
};

export default PrivateProfileOverview;