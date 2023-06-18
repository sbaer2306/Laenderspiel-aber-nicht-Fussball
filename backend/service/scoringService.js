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
        if(typeof fact.answer == 'number') score += numberTolerance(fact.answer, matchingData.answer, matchingData.tries)
        else if(matchingData.answer === fact.answer){
          const dataTries = matchingData.tries;
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