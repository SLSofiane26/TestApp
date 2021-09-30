import React from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import Application from './Application/Application';
import Reducer from './Reducer/Reducer';

let App = React.memo(function App(props) {
  let store = createStore(Reducer, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
});

export default App;
