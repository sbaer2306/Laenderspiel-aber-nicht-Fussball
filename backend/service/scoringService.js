async function calculateRatingFacts(facts, guessedData){
    try{
      let score = 0;
      const time = guessedData.time;
      score += time/100 + 1;  //each 100 sek minus one point
  
      // Modify factsObj to include country_name and exclude unMember
      const modifiedFacts = [
        facts.country_name,
        ...facts.facts.slice(1).filter((fact) => !fact.hasOwnProperty('unMember')).map((fact) => String(Object.values(fact)[0]).toLowerCase()),
      ];
  
      //Scoring wrong = 0, right = 4 - tries
      score += evaluatePointsForFacts(guessedData.answers, modifiedFacts);
  
      score += guessedData.flag ? 4 : 0;
  
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
        score += 4 - answerObj.tries;
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