/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/redux/storeConfig';

import {ChatScreen} from './app/screens';


const App = () => {
  return (
    <Provider store={store}>
      <ChatScreen />
    </Provider>
  );
};

export default App;
