import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index'; 

export function* purchaseBurgerSaga(action) {
    yield put (actions.purchaseBurgerStart());
    try {
    const response = yield axios.post('orders.json?auth=' + action.token, action.orderData)  
    yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
    } catch(error){
        yield put(actions.purchaseBurgerFailed(error));
    }       
}

export function* fetchOrdersSaga(action){
    const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
    yield put(actions.fetchOrdersStart());
    try {
        const response = yield axios.get('/orders.json'+queryParams);
           
        const fetchedOrders = [];
        for (let key in response.data) {
            console.log(response.data[key]);
            fetchedOrders.push({
                ...response.data[key],
                id: key
            });
        }
        yield put(actions.fetchOrdersSuccess(fetchedOrders));
            
    }catch(error) {    
            yield put(actions.fetchOrdersFail(error));
        }    
}