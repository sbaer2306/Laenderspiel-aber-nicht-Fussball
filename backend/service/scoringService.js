const sightsService = require('../service/sightsService');

/**
* Calculates the rating for each sight in the provided data based on the guessed coordinates,
* and returns the total score for the game taking into account the distance, number of sights,
* time, and difficulty level.
* @param {Object} data - The data containing information about the cities, coordinates, guessed coordinates, and number of sights.
* @param {number} difficulty - The difficulty level of the game.
* @returns {Promise<number>} - A Promise that resolves to the total score for the game.
* @throws {Error} - If an error occurs during the process.
*/
async function calculateRatingSights(data, difficulty) {
  try {

    const MAX_TIME = 180;

    const scores = {};

    for (const city in data) {
      if (city !== "time" && city !== "gameDuration") {
        const coordinates = data[city].coordinates;
        const guessedCoordinates = data[city].guessed_coordinates;
        const numberOfSights = data[city].sights;

        const distance = sightsService.calculateDistance(coordinates[0], coordinates[1], guessedCoordinates[0], guessedCoordinates[1]);

        const score = calculateScore(distance, numberOfSights);

        scores[city] = score;
      }
    }

    const time = data.time;

    let totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    totalScore += totalScore == 0 ? 0 : MAX_TIME - time;
    totalScore *= difficulty;

    return Math.round(totalScore);
  } catch (error) {
    return { error: error.message };
  }
}

/**
* Calculates the score based on the distance and the number of sights.
* @param {number} distance - The distance between the guessed coordinates and the actual coordinates.
* @param {number} numberOfSights - The number of sights for the given city.
* @returns {number} - The calculated score.
*/
function calculateScore(distance, numberOfSights) {

  let score = 500 - Math.round(distance);

  if (numberOfSights === 1) {
    score *= 2;
  } else if (numberOfSights === 2) {
    score *= 1.5;
  }

  score = score <= 0 ? 0 : score;
  return Math.round(score);
}

async function calculateRatingFacts(facts, guessedData){
  const MAX_TIME = 300 //5min
    try{
      let score = 0;
  
      const countryObject = {
        question_keyword: "country_name",
        answer: facts.country_name.toLowerCase(),
      }
      let modifiedFacts = facts.facts.slice(); //array
      modifiedFacts.push(countryObject);
      modifiedFacts = modifiedFacts.map(fact => {
        if (typeof fact.answer === "string") {
          return {
            ...fact,
            answer: fact.answer.toLowerCase()
          };
        } else {
          return fact;
        }
      });
      
      const data = guessedData.answers.map(answer => {
        if (typeof answer.answer === "string") {
          return {
            ...answer,
            answer: answer.answer.toLowerCase()
          };
        } else {
          return answer;
        }
      });
      score = evaluatePointsFacts(modifiedFacts, data)
  
      if(guessedData.flag) score+= 300;
      const time = guessedData.time;
      if(score !== 0) score += MAX_TIME - time;

      return score;
  
    }catch(error){
      return {error: error.message, facts: facts, guessedData: guessedData, guessedDataAnswers: guessedData.answers};
    }
  }

  const evaluatePointsFacts = (modifiedFacts, data) => {
    let score = 0;
    for(let i = 0; i < modifiedFacts.length; i ++){
      if(data[i].answer === "") continue; 
      const fact = modifiedFacts[i];
      const matchingData = data.find(answer => answer.question_keyword ===fact.question_keyword);
      if(matchingData){
        const dataTries = matchingData.tries;
        if(fact.question_keyword === "border countries"){
          const borderSolution = fact.answer.toLowerCase();
          if(borderSolution.includes(matchingData.answer)){
            score += 800 - (dataTries * 100);
          }
        }
        if(typeof fact.answer == 'number') score += numberTolerance(fact.answer, matchingData.answer, matchingData.tries)
        else if(matchingData.answer === fact.answer){
          score += 800 - (dataTries * 100);
        }
      }
      
      
    }
    return score;
  }

  const numberTolerance = (fact, data, tries) => {
    let score = 0;
    const upperEnd = fact* 1.1;
    const lowerEnd = fact * 0.9;
    if(upperEnd > data && data > lowerEnd) score += 800 - (100 * tries);
    return score;
  }

/**
 * Calculates the geo-information score based on distance, time, and difficulty factors.
 * 
 * @param {number} distance - The distance in kilometers.
 * @param {number} time - The time in seconds.
 * @param {number} difficulty - The difficulty factor.
 * @returns {number} - The calculated geo-information score.
 */
function calculateGeoInformation(distance, time, difficulty){
  let score;
  max_time = 300; //Timelimit of 5 mins

  //if the distance is greater than 2000 km, the score is 0 
  score = 2000 - distance; 
  
  if(score <= 0) {
      return 0;
  }

  //add the remaining time to the score 
  score += max_time - time;
  
  //Multiply the Score with the difficulty
  score = score * difficulty;

  return score;
}

  


  module.exports = {calculateRatingFacts, calculateGeoInformation, calculateRatingSights};