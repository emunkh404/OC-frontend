import React, { Component } from "react";
import routes from '../routes'
import logger from "../services/logService";

import httpService from "../services/httpService";
import jwtDecode from 'jwt-decode';
import { setCurrentUser, logoutUser } from "../actions/authActions"

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './common/Loading'

import config from "../config.json";
import "../App.css";

const { persistor, store } = configureStore();
const tokenKey = config.tokenKey;

// Check for token
if (localStorage.getItem(tokenKey)) {
  // Set auth token header auth
  httpService.setjwt(localStorage.getItem(tokenKey));
  // Decode token and get user info and exp
  const decoded = jwtDecode(localStorage.getItem(tokenKey));
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.expiryTimestamp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
  }
}

class App extends Component {
  state = {};

  componentDidCatch(error, errorInfo) {
    logger.logError(error);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading/>} persistor={persistor}>
          <Router>
            { routes }
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;