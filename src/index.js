import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'; 

import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose } from 'redux';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import userContactDataReducer from './store/reducers/userContactData';

//Saga Watchers
import { watchAuth, watchBurgerBuilder, watchOrder } from './store/sagas/index';


//ToastNotification
import ReactNotification from 'react-notifications-component'
import toastNotificationClasses from './components/UI/ToastNotification/ToastNotification.module.css';
import 'react-notifications-component/dist/theme.css'

const rootReducer = combineReducers({ //Combining the 2 reducers
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer,
  userContactData: userContactDataReducer
});


const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);

//
let intFrameWidth = window.innerWidth;
  let isMobile = false;
  if (intFrameWidth < 500) {
    isMobile= true;
  }

const app = (
  <Provider store={store}>
    <BrowserRouter >
      <ReactNotification isMobile breakpoint={758} className={isMobile ? toastNotificationClasses.ToastNotificationMobile : ""}/>
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
