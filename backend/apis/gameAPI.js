//APIs for Game
import axios from 'axios';

export const getGameFacts = async (game_id) => {
    try{
        const response = await axios.get(`/game/${game_id}/facts`);
        return response.data;
    }catch(error){
        throw new Error("Failed to fetch game facts");
    }
}