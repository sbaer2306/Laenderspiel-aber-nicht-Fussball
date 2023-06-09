import { useParams } from 'react-router-dom';
import PublicProfilePreviewCard from './ProfilePreviewCard';
import GameHistory from './GameHistory';
import { Box } from '@chakra-ui/react';

const PublicProfileOverview = () => {
  const { id } = useParams();

  return (<>
  <PublicProfilePreviewCard userId={parseInt(id)} />
  <Box maxW='700px' mx='auto' my='10'>
    <GameHistory id={parseInt(id)} />
  </Box>
  
  </>);

};

export default PublicProfileOverview;
