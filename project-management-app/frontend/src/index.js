import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || 'dev-uxxstde2se2qa88v.us.auth0.com'}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || '1FqyRUzf8JEjvupCbIseAYvN5XM0rnhT'}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
