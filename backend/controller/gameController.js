const createHelper = require('../helpers/createGameHelper')
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();
const { validateId } = require('../helpers/invalidIDhelper');

/**
 * Creates a new game for a player depending on the difficulty chosen. 
 * Game will be cached for a certain time and either gets destroyed or saved if the player finishes the game.
 * @param {object} request - the request object
 * @param {object} response - the response object
 * @returns {Promise<void>} - A Promise that resolves when the response is sent
 * @returns {Object} The game object in JSON format when the creation is successful (HTTP 201).
 * @returns {Object} The links object for hypermedia in JSON format when the creation is successful (HTTP 200).
 */
async function createGame(req, res){
    
  const difficulty = req.body.difficulty;
  try{
      
      //auth
      //user_id = something


      // Check if the user already has a game in the session
      if (req.session.game) {
        return res.status(403).json({ error: 'You already have a game in progress', game: req.session.game.current_round });
        //further logic to implement: delete old session or continue same game
      } 

      //get countries from cache or cache them if not already for one week 
      let seperatedCountries = await createHelper.getCountries();
      
      
      //select a random country depending on difficulty level and checking if country was already played from user
      const countriesByDifficulty = seperatedCountries[difficulty];
      let selectedCountry = await createHelper.getRandomCountryForDifficulty(countriesByDifficulty);

      const game = {
        id: req.session.id, //session_id
        user_id: 3, //user_id comes from middleware - please give it to me bastiiii :D
        current_round: 1,
        max_rounds: 3,
        ttl: 900,
        created_at: new Date().toISOString(),
        difficulty: selectedCountry.difficultyMultiplier,
        country_id: Number(selectedCountry.id),
        country_name: selectedCountry.name,
        total_score: 0,
      }

      const links = {
        nextStep: {
          description: 'Retrieve facts for the newly created game. ',
          operationRef: `/game/facts/`,
          parameters: {
            id: game.id,
          }
        }
      }

      //saving created game in session - each session will automatically be identified by the unique session-id and a player can only play one game at a time.
      req.session.game = game;

      res.status(201).json({
        game,
        links
      });

    }catch(error){
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * 
 * @param {Object} req - the request object with the id in the parameters
 * @param {Object} res - the response object 
 * @returns {Promise<void>} - A promise that resolves when the game retrieval is completed
 * @returns {Object} The game object in JSON format when the retrieval is successful (HTTP 200).
 */
async function getGame(req, res){
  
  const {id} = req.params;
  if(validateId(id, res)) return; //400
  
  try{
    const game = req.session.game;
    //to test
    const user_id = 3;
      //bastis user_id
      if(game.user_id !== user_id) return res.status(403).json({message: "Unauthorized - user is not the player of the game"})
      if(game.id !== Number(id)) return res.status(404).json({message: "Game not found"})
      req.session.game = game;
      res.status(200).json({ game: game });

  }catch(error){
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Searching for a game on id in the parameter and deletes it. 
 * @param {Object} req - the request object with the id in the parameters
 * @param {Object} res - the response object
 * @returns {Promise<void>}
 */
async function deleteGame(req, res){
  const {id} = req.params;
  if(validateId(id, res)) return; //400
  
  try{
    const game = req.session.game;
    //to test
    const user_id = 3;
    //bastis user_id
    if(game.user_id !== user_id) return res.status(403).json({message: "Unauthorized - user is not the player of the game"})
    if(game.id !== Number(id)) return res.status(404).json({message: "Game not found", gameid: game.id, id: id})
    
    req.session.game = null;
    res.status(200).json({ message: "Game successfully cancelled. No content." });

  }catch(error){
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {createGame, getGame, deleteGame}

