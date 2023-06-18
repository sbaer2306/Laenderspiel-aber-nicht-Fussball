const sightsService = require('../service/sightsService');

async function calculateRatingSights(data) {
  try {

    const MAX_TIME = 180;

    const scores = {};

    for (const city in data) {
      if (city !== "time_to_complete_game") {
        const coordinates = data[city].coordinates;
        const guessedCoordinates = data[city].guessed_coordinates;
        const numberOfSights = data[city].sights;

        const distance = sightsService.calculateDistance(coordinates[0], coordinates[1], guessedCoordinates[0], guessedCoordinates[1]);

        const score = calculateScore(distance, numberOfSights);

        scores[city] = score;
      }
    }

    const time = data.time_to_complete_game;

    let totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    totalScore += totalScore == 0 ? 0 : MAX_TIME - time;

    return totalScore;
  } catch (error) {
    return { error: error.message };
  }
}

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
  
      // Modify factsObj to include country_name and exclude unMember
      const modifiedFacts = [
        ...facts.facts.map((fact) => String(Object.values(fact)[0]).toLowerCase()),
        facts.country_name.toLowerCase(),
      ];
  
      //Scoring wrong = 0, right = 400 - 100/try
      score += evaluatePointsForFacts(guessedData.answers, modifiedFacts);
  
      score += guessedData.flag ? 300 : 0;
  
      const time = guessedData.time;
      score += score == 0 ? 0 : MAX_TIME - time  //only time score if some values are right
      return score;
  
    }catch(error){
      return {error: error.message, facts: facts, guessedData: guessedData};
    }
  }
  
  const evaluatePointsForFacts = (answers, facts) => {
    let score = 0;
    for(let i = 0 ; i < answers.length; i++){
      const answerObj = answers[i];
      const answer = String(answerObj.answer);
        if(answer.toLowerCase() === facts[i]){
          score += 400 - 100*answerObj.tries;
        }
    }
    return score;
  }

  /**
   * facts = {
          country_name: factsData.name.official,
          facts: [
            {border: borderCountryName}, 
            {currency: Object.values(factsData.currencies)[0].name},
            {capital: factsData.capital[0]},
            {language: Object.values(factsData.languages)[0]},
            {area: factsData.area},
            {continent: factsData.continents[0]},
            {population: factsData.population},
          ], 
          flags: flagResponses,
        }
   */

  function calculateGeoInformation(distance){
        let score;
        
        score = 2000 - distance;
        
        //TODO: Time component
        if(score <= 0) {
            return 0;
        }
        
    return score;
  }

  


  module.exports = {calculateRatingFacts, calculateGeoInformation, calculateRatingSights};