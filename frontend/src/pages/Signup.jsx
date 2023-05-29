import React from 'react';
import { GoogleLogin } from 'react-google-login';

export default function Signup() {
    const responseGoogle = (response) => {
        console.log(response);
        let googleResponse = response.profileObj;
        let token = response.tokenId; // Der Token

        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Erfolg:', data);
        })
        .catch((error) => {
            console.error('Fehler:', error);
        });
    }

    return (
        <div>
            <GoogleLogin
                clientId="YOUR_CLIENT_ID"
                buttonText="Sign up with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
}

