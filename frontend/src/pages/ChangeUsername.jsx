import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetUsername = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await axios.get('/api/username'); // Setzen Sie hier die URL Ihres Endpunkts ein
                setUsername(response.data.username);
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen des Benutzernamens:', error);
            }
        };

        fetchUsername();
    }, []);

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div>
            <label>
                Benutzername:
                <input type="text" value={username} onChange={handleInputChange} />
            </label>
        </div>
    );
};

export default SetUsername;
