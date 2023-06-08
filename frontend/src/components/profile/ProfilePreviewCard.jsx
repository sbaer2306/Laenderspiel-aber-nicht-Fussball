import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Flex, Box, Heading, Text, Avatar, Divider } from '@chakra-ui/react';
import { BsPerson, BsGeoAlt } from 'react-icons/bs';

const PublicProfilePreviewCard = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/${userId}/profile`);
        setProfile(response.data);
      } catch (error) {
        const { status } = error.response;

        let errorMessage = 'An error occurred. Please try again later.';

        if (status === 404) {
          errorMessage = 'Profile not found.';
        } else if (status === 403) {
          errorMessage = 'Access denied.';
        } else if (status === 500) {
          errorMessage = 'Internal server error.';
        }

        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProfile();
  }, [userId, toast]);

  if (!profile) {
    return (
      <Box>
        <Text>Nothing to see here.</Text>
      </Box>
    );
  }

  const { firstName, lastName, bio, location } = profile;

  return (
    <Box maxW='500px' mx='auto' borderWidth='1px' p='4' borderRadius='12'>
      <Flex alignItems="center" mb={4}>
        <Avatar size="lg" name={`${firstName} ${lastName}`} mr={4}>
        </Avatar>
        <Text fontWeight="bold" fontSize="xl">{`${firstName || 'Unknown'} ${lastName || 'User'}`}</Text>
      </Flex>
      <Divider mb={4} />
      <Text textAlign="left">{bio || 'No bio available.'}</Text>
      <Divider my={4} />
      <Flex alignItems="center" mt={2}>
        <BsGeoAlt size={20} />
        <Text ml={2}>{location || 'Unknown'}</Text>
      </Flex>
    </Box>
  );
};

export default PublicProfilePreviewCard;