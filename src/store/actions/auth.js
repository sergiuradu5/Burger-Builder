import * as actionTypes from './actionTypes';
import axios from 'axios';
import API_KEY from '../../helpers/APIKey/APIKey';

import {ToastNotification} from '../../components//UI/ToastNotification/ToastNotification';

//A method for resetting previous userContactData
export const resetUserContactData = () => {
    return {
        type: actionTypes.RESET_USER_CONTACT_DATA
    }
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};


export const authSuccess = (tokenId, userId, auto, method) => {
    let authMessage = {
        title: "Logged In",
        message: "Welcome Back!"
    };
    if (auto === false) {

        if(method === "signUp") {
            authMessage['title'] = "Signed Up Successfuly";
            authMessage['message'] = "Welcome!";
        }

        ToastNotification({
            title: authMessage.title,
            message: authMessage.message,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
        });
    }
     return {
        type: actionTypes.AUTH_SUCCESS,
        tokenId: tokenId,
        userId: userId
    }
}

export const authFail = (error) => {
    ToastNotification({
        title: "Authentication Failed",
        message: error,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });

    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = (auto) => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    if (auto === false) {
        ToastNotification({
            title: "Logged Out",
            message: " ",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
        });
    }
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const logoutAndResetUserContactData = (auto) => {
    return dispatch => {
        dispatch(resetUserContactData());
        dispatch(logout(auto));
    }
}


export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logoutAndResetUserContactData());      
        }, expirationTime);    
    }
}

export const auth = (email, password, method) => {
    return dispatch => {
        
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true 
        };
        let url = '';
        if (method === "signIn") {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY;
        } else if (method === "signUp") {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000); //3600 seconds converting to milliseconds
                const auto = false;
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId, auto, method));
                dispatch(checkAuthTimeout(response.data.expiresIn * 1000));
            })
            .catch(error => {
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
                dispatch(authFail(errorMessage));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        
        const auto=true;
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logoutAndResetUserContactData());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            
              if(expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                
                dispatch(authSuccess(token, userId, auto));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
                                    //both expirationDate and current Date have to be in milliseconds
              } else {
                  dispatch(logoutAndResetUserContactData(auto))
              }

            
        }
    }
}