import { useState } from 'react';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import MonthlyRanking from './Monthly/MonthlyRanking';
import AllTimeRankingTable from './AllTime/AllTimeRankingTable';

function Ranking() {
  const [selectedRanking, setSelectedRanking] = useState('allTime');

  const handleRankingToggle = (ranking) => {
    setSelectedRanking(ranking);
  };

  return (
    <Box maxW='500px' mx='auto'>
      <ButtonGroup isAttached variant='outline' size='md' my='10'>
        <Button
          onClick={() => handleRankingToggle('allTime')}
          colorScheme={selectedRanking === 'allTime' ? 'blue' : 'gray'}
        >
          All Time
        </Button>
        <Button
          onClick={() => handleRankingToggle('monthly')}
          colorScheme={selectedRanking === 'monthly' ? 'blue' : 'gray'}
        >
          Monthly
        </Button>
      </ButtonGroup>
      {selectedRanking === 'allTime' ? (
        <AllTimeRankingTable />
      ) : (
        <MonthlyRanking />
      )}
    </Box>
  );
}

export default Ranking;
