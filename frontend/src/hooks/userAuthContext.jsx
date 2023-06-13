import React, { useState, createContext, useContext, useEffect } from "react";
import api from "../helpers/axios.js";


const userAuthContext = createContext(undefined);

export const UserAuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/userinfo');
      const user = response.data.user;
      return user;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentToken) {
        const user = await fetchUser();
        console.log("user fetched: ", user);
        setCurrentUser(user);
      }
    }
    fetchUserData();
  }, [currentToken]);

  const handleGoogleLogin = () => {
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
      ].join(' ')
    };
  
    const qs = new URLSearchParams(options);
  
    const loginUrl = `${rootUrl}?${qs.toString()}`;
    window.location.href = loginUrl;
  };

  const setUserToken = (jwt_token) => {
      console.log("setting token: ", jwt_token);
      setCurrentToken(jwt_token);
      api.defaults.headers.common["authorization"] = `jwt ${jwt_token}`;
  }

  const getCurrentUser = () => {
    return currentUser;
  }

  const getCurrentUserToken = () => {
    return currentToken;
  }

  const userIsLoggedIn = () => {
    return currentToken !== null;
  }

  const logout = () => {
    setCurrentToken(null);
    setCurrentUser(null);
    api.defaults.headers.common["authorization"] = null;
  };

  return (
    <userAuthContext.Provider value={{ currentUser, currentToken, handleGoogleLogin, setUserToken, logout, userIsLoggedIn, getCurrentUser }}>
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(userAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthContextProvider");
  }
  return context;
};