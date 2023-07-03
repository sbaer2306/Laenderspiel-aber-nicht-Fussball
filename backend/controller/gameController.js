const gameService = require('../service/gameService');

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
  const userID = req.user.id;
  const difficulty = req.body.difficulty;
  try{
      //for easy access
      const gameID = userID

      const redisClient = req.redis;
      const existingGame = await redisClient.hget(gameID, 'games');
      if(existingGame){
        return res.status(409).json({ message: 'You already have a game in progress', game: JSON.parse(existingGame) });
      }

      //get countries from cache or cache them if not already for one week 
      let seperatedCountries = await gameService.getCountries();
      
      
      //select a random country depending on difficulty level and checking if country was already played from user
      const countriesByDifficulty = seperatedCountries[difficulty];
      let selectedCountry = await gameService.getRandomCountryForDifficulty(countriesByDifficulty);

      //creates game and stores in redis db
      const game = await gameService.createGameInDatabase(redisClient, gameID, userID, selectedCountry.difficultyMultiplier, selectedCountry.id, selectedCountry.name, selectedCountry.countryCode);

      const links = {
        nextStep: {
          description: 'Retrieve facts for the newly created game. ',
          operationRef: `/game/facts/`,
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
  const redisClient = req.redis;
  const userID = req.user.id;
  
  try{
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);
    if(!game) return res.status(404).json({message: "Game not found", gameid: game.id, id: id})
    if(game.user_id !== userID) return res.status(403).json({error: "Forbidden. User is not player of the game.", game_user_id: game.user_id, id: id, userid: userID});
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
  const redisClient = req.redis;
  const userID = req.user.id;
  
  try{
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);
    if(!game) return res.status(404).json({message: "Game not found", gameid: game.id, id: id})
    if(game.user_id !== userID) return res.status(403).json({error: "Forbidden. User is not player of the game.", game_user_id: game.user_id, id: id, userid: userID});
    
    await redisClient.hdel(id, 'games');
    res.status(200).json({ message: "Game successfully cancelled." });

  }catch(error){
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

async function endGame(req, res){
  const {id} = req.params;
  const redisClient = req.redis;
  const userID = req.user.id;
  
  try{
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);
    if(!game) return res.status(404).json({message: "Game not found", gameid: game.id, id: id})
    if(game.user_id !== userID) return res.status(403).json({error: "Forbidden. User is not player of the game.", game_user_id: game.user_id, id: id, userid: userID});
    
    await redisClient.hdel(id, 'games');
    res.status(200).json({ message: "Game successfully cancelled." });

  }catch(error){
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}






module.exports = {createGame, getGame, deleteGame}

