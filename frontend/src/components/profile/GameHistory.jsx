import { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Text, Divider } from '@chakra-ui/react';
import { formatDate } from '../../helpers/date';
import {secondsToHumanReadable} from '../../helpers/time';
import { VscArrowSmallLeft, VscArrowSmallRight } from 'react-icons/vsc';
import api from "../../helpers/axios.js";

function GameHistory({ id }) {


  const [gameHistory, setGameHistory] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async (page = 1, pageSize = 5) => {
    try {
      const response = await api.get(`/user/${id}/played-games`, {
        params: {
          page: page,
          pageSize: pageSize
        }
      });
      const data = response.data;
      setGameHistory(data.playedGames);
      setNextPage(data._links.next?.href);
      setPrevPage(data._links.prev?.href);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if(status === 403){
          console.log('Private profile.')
          setIsPrivate(true);
          return;
        }
      }
      console.error('Error fetching game history:', error.response);
    }
  };  

  const handleLoadNext = () => {
    if (nextPage) {
      const pageRegex = /page=(\d+)/;
      const match = pageRegex.exec(nextPage);
      const nextPageNumber = match ? parseInt(match[1]) : null;
      if (nextPageNumber) {
        fetchGameHistory(nextPageNumber);
      }
    }
  };

  const handleLoadPrev = () => {
    if (prevPage) {
      const pageRegex = /page=(\d+)/;
      const match = pageRegex.exec(prevPage);
      const prevPageNumber = match ? parseInt(match[1]) : null;
      if (prevPageNumber) {
        fetchGameHistory(prevPageNumber);
      }
    }
  };

  return (
    <div>
      <Text fontSize='lg' fontWeight='bold'>Game History</Text>
    {isPrivate ? <Text fontSize='md'>This user has set their profile to private. 🔒</Text> : (
        <><Divider my={2} />
      <Table variant="simple" size='sm'>
        <Thead>
          <Tr>
            <Th>Country</Th>
            <Th>Score</Th>
            <Th>Duration</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {gameHistory.map((game) => (
            <Tr key={game.id}>
              <Td fontWeight='semibold'>{game.country.name}</Td>
              <Td>{game.score}</Td>
              <Td>{secondsToHumanReadable(game.gameDuration)}</Td>
              <Td>{formatDate(game.createdAt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div>
        {prevPage && <Button my={2} mx={10} colorScheme='green' onClick={handleLoadPrev} size='sm' leftIcon={<VscArrowSmallLeft />}>Load previous</Button>}
        {nextPage && <Button my={2} mx={10} colorScheme='blue' onClick={handleLoadNext} size='sm' rightIcon={<VscArrowSmallRight />}>Load next</Button>}
      </div>
        </>
    )} 
    </div>
  );
}

export default GameHistory;