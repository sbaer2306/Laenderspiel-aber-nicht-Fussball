const express = require('express')
const router = express.Router()


//ROUTES
//Game
router.get('/:id', async (req, res) => {
    try{
        const gameId = req.params.id;
        //const game = await gameService.getGameById(gameId);
        res.status(200).json(/*game*/)
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        //await gameService.deleteGameById(gameId); 
        res.status(200).send('Game deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;
        //const game = await gameService.createGame(user_id); 
        res.status(201).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Facts
router.get('/:game_id/facts', async (req, res) => {
    try {
        const gameId = req.params.game_id;
        //const facts = await gameService.getGameFacts(gameId); 
        res.status(200).json(facts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:game_id/facts/rating', async (req, res) => {
    try {
        const gameId = req.params.game_id;
        const { guest_token } = req.body;
        //const score = await gameService.rateGame(gameId, guest_token); 
        res.status(200).json({ score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Geo-Information
router.get('/:game_id/geo-information', async (req, res) => {
    try {
        const gameId = req.params.game_id;
        //const facts = await gameService.getGameFacts(gameId); 
        res.status(200).json(facts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Export router
module.exports = router;