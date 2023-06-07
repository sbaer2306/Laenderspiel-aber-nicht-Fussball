import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';

function Navbar() {
    return (
        <><Flex alignItems="center" justifyContent="space-between" px={4} py={2}>
            <Flex alignItems="center">
                <Link to="/">
                    <Text fontSize="xl" fontFamily={'mono'}>⚽🌎 - Laenderspiel</Text>
                </Link>
            </Flex>
            <Flex>
                <Link to="/ranking">
                    <Button colorScheme="green" variant={'ghost'} mr={2}>
                        Top 10 Ranking 🏆
                    </Button>
                </Link>
                <Link to="/api/doc">
                    <Button colorScheme="teal" variant={'ghost'} mr={2}>
                        API Documentation
                    </Button>
                </Link>
            </Flex>
        </Flex></>
        
    );
}

export default Navbar;