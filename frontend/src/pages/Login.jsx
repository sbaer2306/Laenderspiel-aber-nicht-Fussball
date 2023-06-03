import React, { useEffect } from 'react';

export default function Signup() {
    const handleCredentialResponse = (response) => {
        console.log('credential response', response);

        // Hier können Sie den ID-Token an Ihr Backend senden.
        // Sie können entweder fetch oder axios oder eine andere Bibliothek verwenden, um eine HTTP-Anfrage zu machen.
        fetch('http://localhost:3001/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: response.credential }), // Senden Sie den Token in der Anforderung
        })
        .then(response => response.json())
        .then(data => {
            console.log('Erfolg:', data);
        })
        .catch((error) => {
            console.error('Fehler:', error);
        });
    };

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: 'YOUR_CLIENT_ID',
            callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
            document.getElementById('buttonDiv'), 
            {}  // customization attributes
        );
    }, []);

    return (
        <div>
            <div id="buttonDiv"></div>
        </div>
    );
}
