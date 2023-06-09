import React from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, VStack, ModalCloseButton } from "@chakra-ui/react";
import { VscWatch, VscStarEmpty, VscFlame, VscDashboard, VscArchive } from 'react-icons/vsc';
import { secondsToHumanReadable } from '../../../helpers/time';

const StatsModal = ({ stats, onClose, isOpen }) => {

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent  minW='800px'>
          <ModalHeader>Your Stats</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <HStack spacing={2}>
                <VscArchive size={18} />
                <Text fontSize="sm">Total Games Played: {stats.TotalGamesPlayed}</Text>
              </HStack>
              <HStack spacing={2}>
                <VscWatch size={15} />
                <Text fontSize="sm">Total Time Played: {secondsToHumanReadable(stats.TotalTimePlayed)}</Text>
              </HStack>
              <HStack spacing={2}>
                <VscFlame size={15} />
                <Text fontSize="sm">
                  Fastest Game: {stats.FastestGame ? `${stats.FastestGame.country.name} (score: ${stats.FastestGame.score}, time: ${secondsToHumanReadable(stats.FastestGame.gameDuration)})` : " - "}
                </Text>

              </HStack>
              <HStack spacing={2}>
                <VscDashboard size={15} />
                <Text fontSize="sm">
                  Slowest Game: {stats.SlowestGame ? `${stats.SlowestGame.country.name} (score: ${stats.SlowestGame.score}, time: ${secondsToHumanReadable(stats.SlowestGame.gameDuration)})` : " - "}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <VscStarEmpty size={15} />
                <Text fontSize="sm">Total Score: {stats.Ranking.score}</Text>
              </HStack>
              
              <Table size='sm' variant='striped' colorScheme='blue'>
                <Thead>
                  <Tr>
                    <Th>Country</Th>
                    <Th>Games Played</Th>
                    <Th>Avg Score</Th>
                    <Th>Avg Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.CountryGameSummary.map((country, index) => (
                    <Tr key={index}>
                      <Td>{country.CountryName}</Td>
                      <Td>{country.Amount}</Td>
                      <Td>{country.AverageScore}</Td>
                      <Td>{secondsToHumanReadable(country.AverageTime)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default StatsModal;