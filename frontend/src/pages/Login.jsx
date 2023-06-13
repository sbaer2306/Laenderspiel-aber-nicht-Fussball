import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../hooks/userAuthContext';

export const Login = () => {

  const { setUserToken } = useUserAuth();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setUserToken(token); // <--
      //localStorage.setItem('token', token);
      //window.location.href = '/';
    }
  }, [location.search]);

  return (
    <div>
      <h1>Login</h1>
      {/* ... */}
    </div>
  );
};
