import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Spinner,
  Button,
  useToast,
  Heading
} from '@chakra-ui/react';
import {HiRefresh as RefreshIcon} from 'react-icons/hi';
import axios from 'axios';
import { formatDate } from '../../../helpers/date';

function AllTimeRankingTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/ranking/all-time`
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 500) {
          toast({
            title: `Error ${status}`,
            description: 'An error occurred while fetching data.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }
  };

  const handleRowClick = (userId) => {
    alert(`User ID: ${userId}`);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box maxW='500px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Heading my='4'>Alltime Ranking</Heading>
      <Box display='flex' justifyContent='flex-end' p={2}>
      </Box>
      {loading ? (
        <Spinner size='sm'/>
      ) : (
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Rank 🏆</Th>
                <Th>Username✨</Th>
                <Th isNumeric>Score📊</Th>
                <Th>Last updated📅</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => (
                <Tr
                  key={item.id}
                  onClick={() => handleRowClick(item.user_id)}
                  cursor='pointer'
                >
                  <Td fontWeight='bold'>{index + 1}</Td>
                  <Td fontStyle='mono'>@{item.username}</Td>
                  <Td isNumeric fontWeight='semibold'>
                    {item.score}
                  </Td>
                  <Td>{formatDate(item.lastUpdated)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Button
          aria-label='Refresh'
          leftIcon={<RefreshIcon />}
          onClick={handleRefresh}
          isLoading={loading}
          disabled={loading}
          size='sm'
          my={2}
          colorScheme='green'
        > Refresh Ranking 
        </Button>
    </Box>
  );
}

export default AllTimeRankingTable;