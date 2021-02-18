import * as actionTypes from './actionTypes';
import axios from 'axios';
import API_KEY from '../../helpers/APIKey/APIKey';
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (tokenId, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        tokenId: tokenId,
        userId: userId
    }
}
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logout());      
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
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
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
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            
              if(expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
                                    //both expirationDate and current Date have to be in milliseconds
              } else {
                  dispatch(logout())
              }

            
        }
    }
}