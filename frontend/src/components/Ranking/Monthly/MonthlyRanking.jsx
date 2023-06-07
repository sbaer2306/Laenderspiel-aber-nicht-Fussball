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
  Heading,
  useToast,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';
import { formatDate } from '../../../helpers/date';

function MonthlyRanking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2023');
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    if (selectedMonth && selectedYear) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/ranking/monthly/${selectedYear}/${selectedMonth}`
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
    }
  };

  const handleRowClick = (userId) => {
    alert(`User ID: ${userId}`);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December'}
  ];

    const years = [
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    ];

  return (
    <Box maxW='500px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Heading my='4'>Monthly Ranking</Heading>
      <Box display='flex' justifyContent='flex-end' p={2}>
        <Select
          placeholder='Select Month'
          value={selectedMonth}
          onChange={handleMonthChange}
          mr={2}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
        <Select
          placeholder='Select Year'
          value={selectedYear}
          onChange={handleYearChange}
          mr={2}
        >
            {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </Select>
      </Box>
      {loading ? (
        <Spinner size='lg' />
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
      {
          !loading && data.length === 0 && (
            <Box textAlign='center' p={4}>
              Wow, such empty! 🐕
            </Box>
          )
        }
    </Box>
  );
}

export default MonthlyRanking;