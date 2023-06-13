import { useEffect, useState } from 'react';
import { Box, useToast, Text, Divider, useDisclosure } from '@chakra-ui/react';
import ProfileEditor from '../components/profile/editing/ProfileEditor';
import GameHistory from '../components/profile/GameHistory';
import ProfileOperationsButtonBar from '../components/profile/editing/ProfileOperationsButtonBar';
import StatsModal from '../components/profile/stats/StatsModal';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import api from "../helpers/axios.js";
import { useUserAuth } from '../hooks/userAuthContext';
import EditUsernameModal from '../components/profile/editing/EditUsernameModal';

const PrivateProfileOverview = () => {
  const [profile, setProfile] = useState({}); 
  const [eTag, setETag] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stats, setStats] = useState({});

  const { isOpen: deletionModalIsOpen, onOpen: onOpenDeletionModal, onClose: onCloseDeletionModal } = useDisclosure();
  const { isOpen: usernameEditingIsOpen, onOpen: onOpenUsernameEditing, onClose: onCloseUsernameEditing } = useDisclosure();

  const { currentUser } = useUserAuth();

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

    const response = await api.get(`/user/${currentUser.id}/profile`)
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
      const response = await api.put(`/profile/${id}`, profileData);
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
      const response = await api.delete(`/user/${currentUser.id}`);
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
      const response = await api.delete(`/user/${currentUser.id}/played-games`);
      if (response.status === 200) {
        showToastMessage("Game history deleted!", `Removed ${response.data.deletedNum} records.`, "success");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const editUsername = async (values) => {
    // TODO: Implement username editing endpoint call @basti
    // Dran denken: Username muss auch im kontext lokal danach aktualisiert werden!
    alert('TODO: Implement username editing');
    onCloseUsernameEditing();
  };
  
  const calculateStats = async () => {
    try {
      const response = await api.get(`/user/${currentUser.id}/stats`, {
        headers: {
          'If-None-Match': eTag
        }
      });
      const newEtag = response.headers['etag'];
      setETag(newEtag);
      const data = response.data;
      setStats(data);
      
      onOpen();
    } catch (error) {
      if (error.response?.status === 304) {
        showToastMessage("Done - Nothing changed!", "", "success");
        onOpen();
        return;
      }
      handleApiError(error);
    }
  };  

  return (
    <>
    <Text fontSize='lg' fontWeight='semibold' mt={3}>Hi, {currentUser.username}! - Take a look at your profile: </Text>
    <Box maxW='600px' margin='auto' mt={5}>
    <ProfileOperationsButtonBar 
      calcStats={calculateStats}
      deleteHistory={deleteGameHistory}
      deleteAccount={onOpenDeletionModal}
      editUsername={onOpenUsernameEditing}
    />
    </Box>
      {Object.keys(profile).length > 0 && (
      <ProfileEditor passedProfile={profile} updateProfile={updateProfile} />
    )}
    <Box maxW='600px' margin='auto' mt={5}>
      <GameHistory id={currentUser.id}/>
    </Box>

    { Object.keys(stats).length > 0 && (
        <Box maxW='600px' margin='auto' mt={5}>
          <StatsModal stats={stats} isOpen={isOpen} onClose={onClose} />
        </Box>
      )
    }
    <ConfirmationModal isOpen={deletionModalIsOpen} onClose={onCloseDeletionModal} onConfirm={deleteUserAccount} title='User Account Deletion'/>
    <EditUsernameModal isOpen={usernameEditingIsOpen} onClose={onCloseUsernameEditing} onSubmit={editUsername} initialUsername={currentUser.username}/>
    </>
  );
};

export default PrivateProfileOverview;