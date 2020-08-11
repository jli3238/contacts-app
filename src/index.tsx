import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { logger } from 'redux-logger';
import reducer from './redux/reducers';
import './style/index.css';
import App from './App';
import rootSaga from './sagas';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware, logger)
)

sagaMiddleware.run(rootSaga);

render(
  <Suspense fallback={<p>loading...</p>}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
