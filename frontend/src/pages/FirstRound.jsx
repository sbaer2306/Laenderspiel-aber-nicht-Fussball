import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import '../css/FirstRound.css'
import { Facts } from '../components/Facts';
import {Text, CircularProgress, Button} from '@chakra-ui/react';
import api from '../helpers/axios'


const initialAnswerObj = {
    time: 0,
    answers: [
      { border: { answer: "", tries: 0 } },
      { currency: { answer: "", tries: 0 } },
      { capital: { answer: "", tries: 0 } },
      { language: { answer: "", tries: 0 } },
      { area: { answer: "", tries: 0 } },
      { continent: { answer: "", tries: 0 } },
      { population: { answer: "", tries: 0 } },
      { country_name: { answer: "", tries: 0 } }
    ],
    flag: ""
};

export const FirstRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id;
    const [time, setTime] = useState(0)
    const [facts, setFacts] = useState()
    const [flags, setFlags] = useState()
    const [countryAnswer, setCountryAnswer] = useState()
    const [allFactsAnswered, setAllFactsAnswered] = useState(false)
    const [countryAnswered, setCountryAnswered] = useState(false)
    const [flagClicked, setFlagClicked] = useState(false)
    const [randomBoolean, setRandomBoolean] = useState(Array(7).fill(false))

    const [answer, setAnswer] = useState(initialAnswerObj)

    const MAX_TIME = 300; //10min for now
    const LENGTH = 7
    const COUNT = 3

    useEffect(() => {
        randomGenerator();
        fetchGameFacts();
        //time
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    },[])

    const fetchGameFacts = async () => {
        try{
            const response = await api.get(`/game/${id}/facts`); 
            
            const factObject = response.data.facts;
            setFacts(factObject.facts);
            setFlags(factObject.flags);
            setCountryAnswer(factObject.country_name)
        }catch(error){
            if(error.response) {
                if(error.response.status === 403){
                    alert("error-response: ", error.response.data.message); //toast
                    navigate('/')  
                }
                //other status controlls
            }
            else console.log("error fetching: "+error.message);
        }
    }
    


    const randomGenerator = () => {
        let updatedArray = [...randomBoolean]; 

        for (let i = 0; i < COUNT; i++) {
            let randomIndex;
            do {
            randomIndex = Math.floor(Math.random() * LENGTH);
            } while (updatedArray[randomIndex]);

            updatedArray[randomIndex] = true;
        }
        setRandomBoolean(updatedArray);
    }
    const handleFlagClick = (flag) => {
        setFlagClicked(true)
        setAnswer(prevState => ({
            ...prevState,
            flag: flag.correct_option
        }));
    }

    const updateAnswer = (title, answer, correct) => {
        console.log("Updating answer with title: ", title, "  - answer: ",answer, "and if correct: ",correct);
        setAnswer(prevState => {
          const updatedAnswers = prevState.answers.map(ans => {
            const key = Object.keys(ans)[0];
            if (key === title) {
              return { [key]: answer };
            }
            return ans;
          });
          return {
            ...prevState,
            answers: updatedAnswers
          };
        });
        console.log("Answer:  ", answer)
        if(title === "country_name" && (correct ||  answer.tries === 3)) setCountryAnswered(true)
    }
    useEffect(()=>{
        setAnswer(prevState => {
            return {
                ...prevState,
                time: Number(time),
            }
        })
    },[time])

    const submitAnswer = async () => {
        
        const requestBody = {
            data: answer
        }
        console.log("requestBody: ", requestBody.data)
        try{
            const response = await api.post(`/game/${id}/rating/facts`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }, {withCredentials: true}); 
            
            const {score, links } = response.data;
            console.log("score: ", score)
            if(links.nextStep){
                navigate(links.nextStep.operationRef, {state: {id: links.nextStep.parameters.id, country_name: links.nextStep.parameters.country_name}}); 
            }
        }catch(error){
            if(error.response) {
                if(error.response.status === 403){
                    alert("error-response: ", error.response.data.message); //toast
                }
                //other status controlls
            }
            else console.log("error fetching: "+error.message);
        }
    }
  return (
    <div className='container_first_round'>
        <div className='headline'>
            <div className='headline_right'>
                <Text mb={1} fontSize='2xl' textAlign="center">
                Runde 1
                </Text>
                <CircularProgress value={time * (100/MAX_TIME)} size='70px' />
            </div>
            
        </div>
        <div className='content_container_first_round'>
            <div className='left_content_first_round '>
                {
                    facts && randomBoolean.map((isTrue, index) => (
                    <Facts
                        key={Object.keys(facts[index])[0]}
                        title={Object.keys(facts[index])[0]}
                        solution={Object.values(facts[index])[0]}
                        tip={isTrue}
                        updateAnswer={updateAnswer}
                    />
                    ))
                }
            </div>
            <div className='right_content_first_round'>
                <div className='country_solution_container '>
                    <div className='country_solution rounded_shadow'>
                    {
                        countryAnswer && (
                            <Facts
                            key={1}
                            title={"country_name"}
                            solution={countryAnswer}
                            tip={false}
                            updateAnswer={updateAnswer}
                        />
                        )
                    }
                    </div>
                </div>
                {
                    countryAnswered && (
                        <div className='flag_container rounded_shadow'>
                            <h3>Flagge</h3>
                            {flags &&
                                flags.map((flag) => (
                                <button key={flag.country_code} onClick={() => handleFlagClick(flag)}>
                                    <img src={flag.flag_url} alt='Flagge' />
                                </button>
                                ))
                            }

                        </div>
                    )
                }
                
            </div>
        </div>
        <div className='button_container'>
         {
            flagClicked && (
                <Button onClick={submitAnswer} colorScheme='blue' size="md">OK</Button>
            )
         }
        </div>
        
    </div>
  )
}
