import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import '../css/FirstRound.css'
import { Facts } from '../components/Facts';
import {Text, CircularProgress} from '@chakra-ui/react';
import axios from 'axios';

const titles = ["Gründungsjahr", "Kontinent", "Hauptstadt", "Fläche", "Währung", "Sprache", "Bevölkerung"];
const solutions = [1949, "Europa", "Berlin", 357000, "EURO", "Deutsch", 82000000];
const country = ["Deutschland"]


export const FirstRound = () => {
    const {game_id} = useParams();
    const [facts, setFacts] = useState()
    const [flags, setFlags] = useState()

    useEffect(() =>{
        const fetchGameFacts = async () => {
            try{
                const config = {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  };
                const response = await axios.get(`http://localhost:8000/game/${game_id}/facts`, config);
                
                console.log(response);
                const factObject = response.data.facts;
                setFacts(factObject.facts);
                setFlags(factObject.flags);
            }catch(error){
                console.log("error fetching: "+error);
            }
        }

        return () => {
            fetchGameFacts();
        }
    }, [game_id])
  return (
    <div className='container_first_round'>
        <div className='headline'>
            <div className='headline_right'>
                <Text mb={1} fontSize='2xl' textAlign="center">
                Runde 1
                </Text>
                <CircularProgress value={20} size='70px' />
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
                <div className='flag_container rounded_shadow'>
                    <h3>Flagge</h3>
                    <div>Deutschland</div>
                    <div>Nigeria</div>
                    <div>Belgienn</div>
                </div>
            </div>
        </div>
    </div>
  )
}
