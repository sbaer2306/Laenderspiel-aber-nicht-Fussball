import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Box, Button, Center, Text } from '@chakra-ui/react';

class GoogleLoginButton extends React.Component {
  handleGoogleLogin = () => {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

    const options = {
      redirect_uri: 'http://localhost:8000/api/auth/google/callback',
      client_id: '309647332008-sh1um2m2usfephkeo3hcccn17okpra2q.apps.googleusercontent.com',
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      state: this.props.from, // Assuming `from` is a prop passed to this component.
    };
  
    const qs = new URLSearchParams(options);
  
    const loginUrl = `${rootUrl}?${qs.toString()}`;
    window.location.href = loginUrl;
  };

  render() {
    return (
      <Button
            leftIcon={<FcGoogle />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={this.handleGoogleLogin}>
        Login with Google
      </Button>
    );
  }
}

export default GoogleLoginButton;
