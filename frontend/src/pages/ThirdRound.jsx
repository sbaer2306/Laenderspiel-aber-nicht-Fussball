import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const ThirdRound = () => {
  const url = 'http://localhost:8000/game/400/sights';
  const [sights, setSights] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const createGame = async () => {
    try {
      const gameResponse = await axios.post('http://localhost:8000/game', {
        difficulty: 'easy',
      });
      setCountryName(gameResponse.data.game.country_name);
    } catch (error) {
      console.log(error);
    }
  };

  const getSights = async () => {
    try {
      const response = await axios.get(url);
      setSights(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await createGame();
        await getSights();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    <h1>Country: {countryName}</h1>
    <h2>Sights:</h2>
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <ul>
        {Object.keys(sights).map((city) => {
          const sight = sights[city];
          return (
            <li key={city}>
              <strong>{city}</strong>
              <ul>
                {sight.sights.map((sightItem, index) => (
                  <li key={index}>
                    <div>
                      <h3>{sightItem.name}</h3>
                      <img src={sightItem.image} alt={sightItem.name} />
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    )}
  </div>
  );
};

export default ThirdRound;
