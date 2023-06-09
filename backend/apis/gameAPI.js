//APIs for Game
import axios from 'axios';


export const createNewGame = async (difficulty) => {
    try{
        const response = await axios.post('/game', {
        difficulty: difficulty
        });
        const {game, links} = response.data;

        //link logic
        if(links && links.nextStep){
            const nextStepLink = links.nextStep;
            //navigate
        }
        console.log("Game from response.data: ", game);
    }catch(error){
        console.log("error createNewGame: ",error);
    }
}
export const getGameFacts = async (game_id) => {
    try{
        const response = await axios.get(`/game/${game_id}/facts`);
        return response.data;
    }catch(error){
        throw new Error("Failed to fetch game facts");
    }
}

export const getGeoInformation = async (game_id) => {
    try{
        const response = await axios.get(`/game/${game_id}/geo-information`);
        return response.data;
    }catch(error){
        throw new Error("Failed to fetch game facts");
    }
}

export const getFirstRoundRating = async (id, frontendValues) => {
    try{
        const response = await axios.post(`/game/${id}/rating/facts`,frontendValues);
        return response.data;
    }catch(error){
        throw new Error("Failed to post rating for facts: ",error);
    }
}