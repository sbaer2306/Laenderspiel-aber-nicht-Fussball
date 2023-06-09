import {HStack, Button, ButtonGroup} from "@chakra-ui/react";
import {VscFlame, VscTrash, VscEdit} from "react-icons/vsc";
import {BiStats} from "react-icons/bi";
function ProfileOperationsButtonBar({calcStats, deleteHistory, deleteAccount, editUsername}){

    return(
        <HStack my={4}>
            <ButtonGroup>
                <Button size='sm' mr={5} leftIcon={<BiStats />} colorScheme='blue' onClick={calcStats}>Calc Stats</Button>
                 <Button size='sm' leftIcon={<VscEdit />} colorScheme='green' onClick={editUsername}>Edit username</Button>
                <Button size='sm' leftIcon={<VscFlame />} colorScheme='orange' onClick={deleteHistory}>Delete History</Button>
                <Button size='sm' leftIcon={<VscTrash />} colorScheme='red' onClick={deleteAccount}>Delete Account</Button>
            </ButtonGroup>
        </HStack>
    )
}

export default ProfileOperationsButtonBar;