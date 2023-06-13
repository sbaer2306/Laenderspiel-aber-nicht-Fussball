import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import '../css/FirstRound.css'
import { Facts } from '../components/Facts';
import {Text, CircularProgress, Button} from '@chakra-ui/react';
import axios from 'axios';


const exampleAnswer = {
    "time": "530",
        "answers":[
            {
            "currency": {
                "answer": "euro",
                "tries": 2
                }
            },
            {
                "capital": {
                    "answer": "Thimphu",
                    "tries": 2
                    }
            },
            {
                "language": {
                    "answer": "Dzongkha",
                    "tries": 1
                    }
            },
            {
                "area": {
                    "answer": 34,
                    "tries": 2
                    }
            },
            {
                "continent": {
                    "answer": "europe",
                    "tries": 1
                    }
            },
            {
                "population": {
                    "answer": 79000000,
                    "tries": 2
                    }
            },{
                "country": {
                    "answer": "Germany",
                    "tries": 1
                    }
            }


        ],
        "flag": true
  }

export const FirstRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const game_id = location.state?.game_id;
    const [time, setTime] = useState(0)
    const [facts, setFacts] = useState()
    const [flags, setFlags] = useState()
    const [allFactsAnswered, setAllFactsAnswered] = useState(false)
    const [countryAnswered, setCountryAnswered] = useState(false)

    const MAX_TIME = 600; //10min for now

    const test = () => {
        setCountryAnswered(!countryAnswered);
    }

    useEffect(() =>{
        const fetchGameFacts = async () => {
            try{
                const config = {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  };
                const response = await axios.get(`http://localhost:8000/game/${game_id}/facts`, config);   //needs to be game/game_id/facts 
                
                console.log(response);
                const factObject = response.data.facts;
                setFacts(factObject.facts);
                setFlags(factObject.flags);
            }catch(error){
                if(error.response) {
                    if(error.response.status === 403){
                        alert("error-response: ", error.response.data.message); //toast
                        navigate('/logged') // logged for now
                    }
                    //other status controlls
                }
                else console.log("error fetching: "+error.message);
            }
        }
        //time
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        fetchGameFacts();

        return () => {
            clearInterval(timer);
        }
    }, [game_id])
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
            <div className='left_content_first_round rounded_shadow'>
                {
                    facts && facts.map((fact) => (
                        <Facts key={Object.keys(fact)[0]} title={Object.keys(fact)[0]} solution={Object.values(fact)[0]}  />
                    ))
                }
            </div>
            <div className='right_content_first_round'>
                <div className='country_solution_container '>
                    <div className='country_solution rounded_shadow'>
                        <Facts key={1} title={"Land"} solution={"Deutschland"} />
                    </div>
                </div>
                {
                    countryAnswered && (
                        <div className='flag_container rounded_shadow'>
                            <h3>Flagge</h3>
                            {
                                flags && flags.map((flag) => (
                                    <img key={flag.country_code} src={flag.flag_url} alt="Flagge"/>
                                ))
                            }
                        </div>
                    )
                }
                
            </div>
        </div>
        <div className='button_container'>
         <Button onClick={test} colorScheme='blue' size="md">TEST</Button>
        </div>
        
    </div>
  )
}
