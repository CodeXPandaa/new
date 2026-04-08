import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading, logout: auth0Logout } = useAuth0();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setLocalUser(decoded);
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (userData, newToken) => {
    setLocalUser(userData);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setLocalUser(null);
    setToken(null);
    localStorage.removeItem('token');
    if (isAuthenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  const user = isAuthenticated ? { ...auth0User, role: 'student' } : localUser;
  const loadingState = auth0Loading || loading;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading: loadingState,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
