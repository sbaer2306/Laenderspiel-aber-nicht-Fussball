import React, {useEffect, useState} from 'react'
//import {useParams} from 'react-router-dom'
//import {getGameFacts} from '../../../backend/apis/gameAPI'
import '../css/FirstRound.css'
import { Facts } from '../components/Facts';

const titles = ["Gründungsjahr", "Kontinent", "Hauptstadt", "Fläche", "Währung", "Sprache"];
const solutions = ["1949", "Europa", "Berlin", "357.000", "EURO", "Deutsch"];


export const FirstRound = () => {
   // const {game_id} = useParams();
    const [facts, setFacts] = useState([])

    useEffect(() =>{
        const fetchGameFacts = async () => {
            try{
                //const response = await getGameFacts(game_id);
            }catch(error){
                console.log("error fetching: "+error);
            }
        }

        return () => {
            fetchGameFacts();
        }
    }, [/*game_id*/])
  return (
    <div className='container_first_round'>
        <div className='headline'>
            <h1>Runde 1</h1>
            <div className='timer_container'>
                <div className='rounded_shadow'>00:00</div>
            </div>
        </div>
        <div className='content_container_first_round'>
            <div className='left_content_first_round rounded_shadow'>
                {
                    Array.from({ length: 6 }, (_, i) => (
                        <Facts key={i} title={titles[i]} solution={solutions[i]} />
                    ))
                }
            </div>
            <div className='right_content_first_round rounded_shadow'>
                <div className='country_solution_container rounded_shadow'>
                    <h2>Land</h2>
                    <div className='country_solution rounded_shadow'>
                        
                    </div>
                    <button id="solve" className='solve_button_first_round'>Lösen</button>
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
