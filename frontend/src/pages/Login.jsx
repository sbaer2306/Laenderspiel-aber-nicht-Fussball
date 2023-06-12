import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Login = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  }, [location.search]);

  return (
    <div>
      <h1>Login</h1>
      {/* ... */}
    </div>
  );
};
