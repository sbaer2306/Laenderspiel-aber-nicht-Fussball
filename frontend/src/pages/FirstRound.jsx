import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import '../css/FirstRound.css'
import { Facts } from '../components/Facts';
import {Text, CircularProgress, Button, useToast, Box} from '@chakra-ui/react';
import api from '../helpers/axios'


const initialAnswerObj = {
    time: 0,
    answers: [
      { question_keyword:"border", answer: "", tries: 0 } ,
      { question_keyword:"currency",answer: "", tries: 0 } ,
      { question_keyword:"capital",answer: "", tries: 0 } ,
      {question_keyword:"language",answer: "", tries: 0 } ,
      { question_keyword:"area",answer: "", tries: 0 } ,
      { question_keyword:"continent",answer: "", tries: 0 } ,
      { question_keyword:"population",answer: "", tries: 0 } ,
      { question_keyword:"country_name",answer: "", tries: 0 } 
    ],
    flag: ""
};

export const FirstRound = () => {
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id;
    const [time, setTime] = useState(0)
    const [facts, setFacts] = useState()
    const [flags, setFlags] = useState()
    const [nextStep, setNextStep] = useState();
    const [answerSubmitted, setAnswerSubmitted] = useState();
    const [countryAnswer, setCountryAnswer] = useState()
    const [allFactsAnswered, setAllFactsAnswered] = useState(false)
    const [countryAnswered, setCountryAnswered] = useState(false)
    const [flagClicked, setFlagClicked] = useState("")
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
            console.log("fact object facts: ", factObject.facts);
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
        setFlagClicked(flag.country_code)
        setAnswer(prevState => ({
            ...prevState,
            flag: flag.correct_option
        }));
    }

    const updateAnswer = (answer, correct) => {
        console.log("Updating answer with question_keyword: ", answer.question_keyword, " answer: ",answer.answer, "and if correct: ",correct);
        setAnswer(prevState => {
          const updatedAnswers = prevState.answers.map(ans => {
            const question_keyword = ans.question_keyword;
            if (question_keyword === answer.question_keyword) {
              return { 
                question_keyword,
                answer: answer.answer,
                tries: answer.tries
               };
            }
            return ans;
          });
          return {
            ...prevState,
            answers: updatedAnswers
          };
        });
        console.log("Answer:  ", answer)
        if(answer.question_keyword === "country_name" && (correct ||  answer.tries === 3)) setCountryAnswered(true)
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
        if(answerSubmitted){
            toast({
                title: "Already submitted ",
                status:"info",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
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
            toast({
                title: "Points ",
                description: `Wow, you made ${score} Points`,
                status:"success",
                duration: 3000,
                isClosable: true,
            });
            if(links.nextStep){
                setNextStep(links.nextStep)
                setAnswerSubmitted(true);
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

    const next = () => {
        if(nextStep){
            navigate(nextStep.operationRef, {state: {id: nextStep.parameters.id, country_name: nextStep.parameters.country_name}});
        }
    }
  return (
    <div className='container_first_round'>
        <div className='headline'>
            <div className='headline_right'>
                <Text mb={1} fontSize='2xl' textAlign="center">
                Round 1
                </Text>
                <CircularProgress value={time * (100/MAX_TIME)} size='70px' />
            </div>
            
        </div>
        <div className='content_container_first_round'>
            <div className='left_content_first_round '>
                {
                    facts && facts.map((fact, index) => (
                    <Facts
                        key={index}
                        title={fact.question_keyword}
                        solution={fact.answer}
                        tip={randomBoolean[index]}
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
                                <button 
                                    key={flag.country_code}
                                    onClick={() => handleFlagClick(flag)}
                                    className={flagClicked === flag.country_code ? 'selected' : ''}
                                >
                                    <img src={flag.flag_url} alt='Flagge' />
                                </button>
                                ))
                            }

                        </div>
                    )
                }
                {
                    flagClicked !== "" && (
                        <Box textAlign="center" mt={5}>
                            <Button onClick={submitAnswer} colorScheme='blue' size="md">OK</Button>
                        </Box>
                        
                    )
                }
                
            </div>
        </div>
        <div className='button_container'>
         {
            answerSubmitted && (
                <Button onClick={next} colorScheme='blue' size="md">Weiter</Button>
            )
         }
        </div>
        
    </div>
  )
}
