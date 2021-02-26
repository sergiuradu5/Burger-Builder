import * as actionTypes from './actionTypes';

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
    });

    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = (auto) => {
    if (auto === false) {
        ToastNotification({
            title: "Logged Out",
            message: " ",
            type: "info",
        });
    }
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    }
}

export const logoutSucceed = () => { 
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
    return {
        type:  actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expirationTime
    }
}

export const auth = (email, password, method) => {
   return {
       type: actionTypes.AUTH_USER,
       email: email,
       password: password,
       method: method
   }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE  
    }
}