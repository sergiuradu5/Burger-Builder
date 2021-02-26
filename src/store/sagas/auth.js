import { delay} from 'redux-saga/effects'; 
import { put } from 'redux-saga/effects';
import * as actions from '../actions/index'; 
import API_KEY from '../../helpers/APIKey/APIKey';

import axios from 'axios';

export function* logoutSaga(action) {
    yield localStorage.removeItem('token'); //what "yield" does is it waits until the execution of the function to its right has finished, then proceeds
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put (actions.logoutSucceed()); //put is in some way the same as "dispatch"
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime);
    yield put (actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart);
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true 
    };
    let url = '';
    if (action.method === "signIn") {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY;
    } else if (action.method === "signUp") {
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
    }
    try {
        const response = yield axios.post(url, authData)
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000); //3600 seconds converting to milliseconds
        const auto = false;
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userId', response.data.localId);
        yield put(actions.authSuccess(response.data.idToken, response.data.localId, auto, action.method));
        yield put  (actions.checkAuthTimeout(response.data.expiresIn * 1000));
    } catch (error) {
        let errorMessage = 'Error';
            // eslint-disable-next-line default-case
            switch(error.response.data.error.message) {
                case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email not found';
                break;

                case 'INVALID_PASSWORD':
                errorMessage = 'Entered password is incorrect';
                break;

                case 'EMAIL_EXISTS':
                errorMessage = 'This email address already exists';
                break;

                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'All requests from this device habe been blocked due to unusual activity. Please try again later.';
                break;
            }
            yield put(actions.authFail(errorMessage));
    }
}

export function* authCheckStateSaga (action) {
    const auto=true;
        const token = yield localStorage.getItem('token');
        if(!token) {
            yield put(actions.logoutAndResetUserContactData());
        } else {
            const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
            
              if(expirationDate > new Date()) {
                const userId = yield localStorage.getItem('userId');
                
                yield put(actions.authSuccess(token, userId, auto));
                yield put(actions.checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
                                    //both expirationDate and current Date have to be in milliseconds
              } else {
                  yield put(actions.logoutAndResetUserContactData(auto))
              }

            
        }
}