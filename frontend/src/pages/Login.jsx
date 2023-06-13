import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../hooks/userAuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

  const { setUserToken } = useUserAuth();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setUserToken(token);
      navigate('/welcome');
    }
  }, [location.search]);

  return (
    <div>
      <h1>Login</h1>
      {/* ... */}
    </div>
  );
};
