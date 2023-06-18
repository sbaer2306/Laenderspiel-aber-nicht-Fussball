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

  function calculateGeoInformation(distance, time){
        let score;
        max_time = 300; //Timelimit of 5 mins

        //if the distance is greater than 2000 km, the score is 0 
        score = 2000 - distance; 
        
        if(score <= 0) {
            return 0;
        }

        //add the remaining time to the score 
        score += max_time - time;
        
    return score;
  }


  module.exports = {calculateRatingFacts, calculateGeoInformation};