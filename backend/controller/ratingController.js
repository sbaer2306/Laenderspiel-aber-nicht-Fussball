const { getPrisma } = require('../prisma/prisma');

const geoService = require('../service/geoService');
const factsService = require('../service/factsService');
const scoringService = require('../service/scoringService')
const sightsService = require('../service/sightsService');

async function calculateRatingFacts(req, res){
  const {id} = req.params;
  const redisClient = req.redis;
  const userID = req.user.id;
  try {
    //Game from redis
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);

    if(!game) return res.status(404).json({error: "Game not found"}) 
    if( game.user_id !== userID){
      return res.status(403).json({error: "Forbidden. User is not player of the game.", game: game, user_id: user_id})
    }

    //get facts from session
    const facts = factsService.getFactsFromCache(game.country_code);
    //get user-input from body
    const {data} = req.body;
    //return res.status(406).json({message: "Not acceptable"})

    const score = await scoringService.calculateRatingFacts(facts, data);

    game.total_score = score;
    game.current_round = 2;
    await redisClient.hset(id, 'games', JSON.stringify(game));
    
    const links = {
      nextStep: {
        description: 'Link for next round with id of game ',
        operationRef: `/game/geo-information`,   
        parameters: {
          id: id,
          country_name: game.country_name
        }
      }
    }

    res.status(200).json({ score, links });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
}

/**
 * Calculates the distance between the guessed position and the center of the country,
 * and calculates the score based on the distance, time, and difficulty level.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
async function calculateDistance(req, res){
  const {id} = req.params;
  const redisClient = req.redis;

  try{
    const gameString = await redisClient.hget(id, 'games');
    const game = JSON.parse(gameString);

    if(!game) return res.status(404).json({error: "Game not found"});

    if(game.user_id !== req.user.id) return res.status(403).json({error: "Forbidden. User is not player of the game."});
    

    const guessed_position = req.body.guessed_position;
    if((guessed_position.lat < -90 || guessed_position.lat > 90) || (guessed_position.lon < -180 || guessed_position.lon > 180)) return res.status(400).json({error: "Bad Request"});

    const center = req.body.center;
    const time = req.body.time;
    const difficulty = game.difficulty;

    let distance = geoService.calculateDistance(guessed_position, center);
    
    let score = scoringService.calculateGeoInformation(distance, time, Math.round(difficulty)) + game.total_score;
    game.total_score = score;
    
    game.current_round = 3;
    await redisClient.hset(id, 'games', JSON.stringify(game));
   
    const links = {
      nextStep: {
        description: 'Link for next round with id of game and the center of the country',
        operationRef: `/game/sights`,   
        parameters: {
          id: id,
          center: center
        }
      }
    }

    res.status(200).json( {distance: distance, score: score, links: links})
  }catch (error){
    console.log(error);
    res.status(500).json({error: 'Internal server error'});
  }
}

async function saveScore(userId, score, gameDuration, countryId, createdAt) {
  try {
    const prismaClient = getPrisma();

    await prismaClient.playedGame.create({
      data: {
        userId: userId,
        score: score,
        gameDuration: gameDuration,
        countryId: countryId,
        createdAt: createdAt
      },
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Monate in JavaScript sind nullbasiert, daher +1
    const currentYear = currentDate.getFullYear();

    // Prüfe, ob ein Datensatz für das aktuelle Monat und Jahr vorhanden ist
    const existingMonthlyRanking = await prismaClient.monthlyRanking.findFirst({
      where: { userId, month: currentMonth, year: currentYear }
    });

    if (existingMonthlyRanking) {
      // Wenn ein Datensatz vorhanden ist, aktualisiere den Score
      await prismaClient.monthlyRanking.update({
        where: { id: existingMonthlyRanking.id },
        data: {
          score: existingMonthlyRanking.score + score,
          lastUpdated: currentDate
        }
      });
    } else {
      // Wenn kein Datensatz vorhanden ist, erstelle einen neuen Datensatz
      await prismaClient.monthlyRanking.create({
        data: {
          userId,
          score,
          month: currentMonth,
          year: currentYear,
          lastUpdated: currentDate
        }
      });
    }

    await prismaClient.allTimeRanking.upsert({
      where: { userId },
      create: {
        userId,
        score,
        lastUpdated: currentDate
      },
      update: {
        score: {
          increment: score
        },
        lastUpdated: currentDate
      }
    });

    return {
      allTimeRanking: await prismaClient.allTimeRanking.findUnique({
        where: { userId }
      }),
      monthlyRanking: await prismaClient.monthlyRanking.findFirst({
        where: { userId, month: currentMonth, year: currentYear }
      })
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save score and update rankings in the database');
  }
}


async function calculateRatingSights(req, res) {
  try {
    const {id} = req.params;
    const game = req.session.game;

    const userId = game.user_id;
    const countryId = game.country_id;
    const createdAt = game.created_at;
    const data = req.body;
    const gameDuration = data.gameDuration;

    if(!game){
      return res.status(404).json({error: "Game not found", game: game, id: id})
    }
    if(userId !== req.user.id) return res.status(403).json({error: "Forbidden. User is not player of the game."});

    const difficulty = game.difficulty;

    const score = await scoringService.calculateRatingSights(data, Math.round(difficulty)) + game.total_score;

    const ranking = await saveScore(userId, score, gameDuration, countryId, createdAt);

    delete req.session.game;
    delete game;

    res.status(200).json({ score: score });
  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = {calculateRatingFacts, calculateDistance, calculateRatingSights}

