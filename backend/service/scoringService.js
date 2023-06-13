async function calculateRatingFacts(facts, guessedData){
  const MAX_TIME = 600 //10min
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

  function calculateGeoInformation(distance){
        let score;
        
        score = 2000 - distance;
        
        //TODO: Time component
        if(score <= 0) {
            return 0;
        }
        
    return score;
  }


  module.exports = {calculateRatingFacts, calculateGeoInformation};