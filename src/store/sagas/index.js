import { takeEvery, all, takeLatest } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import {logoutSaga, 
    checkAuthTimeoutSaga, 
    authUserSaga, 
    authCheckStateSaga} from './auth';
import {
    initIngredientsSaga,
    fetchIngredientPricesSaga
} from './burgerBuilder';
import {
    purchaseBurgerSaga,
    fetchOrdersSaga
} from './order';


export function* watchAuth() {
    yield all ([
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
        takeEvery(actionTypes.AUTH_USER,  authUserSaga),
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
    ]);
    
}

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
    yield takeEvery(actionTypes.FETCH_INGREDIENT_PRICES, fetchIngredientPricesSaga);
}

export function* watchOrder() {
    yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}