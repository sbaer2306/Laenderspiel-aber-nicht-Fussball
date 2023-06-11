const createHelper = require('../helpers/createGameHelper')
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

/**
 * Creates a new game for a player depending on the difficulty chosen. 
 * Game will be cached for a certain time and either gets destroyed or saved if the player finishes the game.
 * @param {object} request - the request object
 * @param {object} response - the response object
 * @returns {Promise<void>} - A Promise that resolves when the response is sent
 */
async function createGame(req, res){
    
  const difficulty = req.body.difficulty;
  try{
      // Check if the user already has a game in the session
/*       if (req.session.game) {
        return res.status(400).json({ error: 'You already have a game in progress' });
        //further logic to implement: delete old session or continue same game
      } */
      

      //get countries from cache or cache them if not already for one week 
      let seperatedCountries = await createHelper.getCountries();
      
      
      //select a random country depending on difficulty level and checking if country was already played from user
      const countriesByDifficulty = seperatedCountries[difficulty];
      let selectedCountry = await createHelper.getRandomCountryForDifficulty(countriesByDifficulty);
      

      //get temporary GameID from PlayedGame last entry id + 1
      const lastGame = await prismaClient.playedGame.findFirst({select: { id: true }, orderBy: { id: 'desc' }});
      const gameId = lastGame ? lastGame.id + 1 : 1; //not working because id also has to increment for every new session

      const game = {
        id: 400, //to test
        user_id: 3, //userId comes from middleware - please give it to me bastiiii :D
        current_round: 1,
        max_rounds: 3,
        ttl: 900,
        created_at: new Date().toISOString(),
        difficulty: selectedCountry.difficultyMultiplier,
        country_id: Number(selectedCountry.id),
        current_score: 0,
        total_score: 0,
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

      //saving created game in session - each session will automatically be identified by the unique session-id and a player can only play one game at a time.
      req.session.game = game;
      session = req.session;

      res.status(201).json({
        session,
        game,
        links
      });

    }catch(error){
      if (error.httpStatusCode) {
        return res.status(error.httpStatusCode).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', difficulty: difficulty });
    }
}


async function getGame(req, res){
  try{
    const {id} = req.params;


    const game = await prismaClient.playedGame.findUnique({
      where: {
        id: Number(id),
      }
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' });
    } else if (1/* authorization logic here */) {
      res.status(403).json({ error: 'Unauthorized - user is not the player of the game' });
    } else {
      res.status(200).json({ game });
    }

  }catch(error){
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

module.exports = {createGame, getGame, deleteGame}

