import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useUserAuth } from '../../hooks/userAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

function Navbar() {

    const navigate = useNavigate();
    const toast = useToast();

    const { logout, userIsLoggedIn } = useUserAuth();

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged out!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top"
        });
        navigate('/');
    }

    return (
        <><Flex alignItems="center" justifyContent="space-between" px={4} py={2}>
            <Flex alignItems="center">
                <Link to="/welcome">
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
                {userIsLoggedIn() && 
                (
                <>
                <Link to="/user/profile">
                    <Button colorScheme="blue" variant={'outline'} mr={2}>
                        My Profile
                    </Button>
                </Link>
                    <Button colorScheme="red" variant={'outline'} mr={2} onClick={handleLogout}>
                        Logout
                    </Button>
                </>
                )
                
                }
            </Flex>
        </Flex></>
        
    );
}

export default Navbar;