const countryService = require('../service/countryService');

async function createGame(req, res){
    try{
      const {difficulty} = req.body;
      const difficultyNumber = difficulty == 'easy' ? 1.0 : difficulty == 'medium' ? 2.0 : 3.0;
      const countries =  await countryService.fetchCountry(); //API returns [LIMIT] countries

      //logic how difficulty should be implemented
      const country = countries[0]; //for testing first country
      const gameID = Math.floor(Math.random() * 100000000);

      const game = {
        id: gameID,
        user_id: 0, //missing in yaml? AuthContextProvider prob
        current_round: 1,
        max_rounds: 3,
        ttl: 900,
        created_at: newDate().toISOString(),
        difficulty: difficultyNumber,
        country_id: country.code,
        current_score: null,
        total_score: null,
      }

      const links = {
        nextStep: {
          description: 'Retrieve facts for the newly created game. ',
          operationRef: '#/paths/~1game~1{id}~1facts/get',
          parameters: {
            id: game.id,
          }
        }
      }

      res.status(201).json({
        game,
        links
      });

    }catch(error){
        console.error('Fehler beim Erstellen eines Games', error);
        res.status(500).json({error: 'Interner Serverfehler'});
    }
}


async function getGame(req, res){
  try{
    const {id} = req.params;
    
    //database request down there
    /*
    const game = await getGame(id)

    res.status(200).json({
      game
    });
    */

  }catch(error){
      console.error('Fehler beim Laden eines Games', error);
      res.status(500).json({error: 'Interner Serverfehler'});
  }
}

async function deleteGame(req, res){
  try {
    const {id} = req.params;

    //database request down there
    //await deleteGame(id);
    res.status(200).send('Game deleted successfully');
  } catch (error) {
      console.error("Fehler beim Löschen eines Games", error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

moduls.exports = {createGame, getGame, deleteGame}

