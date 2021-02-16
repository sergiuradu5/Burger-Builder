import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose } from 'redux';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';


const rootReducer = combineReducers({ //Combining the 2 reducers
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
});

const logger = store => {
  return (next) => {
    return action => {
      console.log('[Middleware] Dispathicng: ', action);
      const result =  next(action);
      console.log('[Middleware] next state: ', store.getState());
      return result;
    }
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <BrowserRouter >
        <App />
    </BrowserRouter>
  </Provider>
);



ReactDOM.render(
  <React.StrictMode>
    {app}  
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
